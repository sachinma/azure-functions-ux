import { SiteTabComponent } from './../../site-dashboard/site-tab/site-tab.component';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription as RxSubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { SlotConfigNames } from './../../../shared/models/arm/slot-config-names';
import { SaveOrValidationResult } from './../site-config.component';
import { LogCategories } from 'app/shared/models/constants';
import { LogService } from './../../../shared/services/log.service';
import { PortalResources } from './../../../shared/models/portal-resources';
import { BusyStateComponent } from './../../../busy-state/busy-state.component';
import { BusyStateScopeManager } from './../../../busy-state/busy-state-scope-manager';
import { CustomFormControl, CustomFormGroup } from './../../../controls/click-to-edit/click-to-edit.component';
import { ArmObj } from './../../../shared/models/arm/arm-obj';
import { CacheService } from './../../../shared/services/cache.service';
import { AuthzService } from './../../../shared/services/authz.service';
import { SiteDescriptor } from 'app/shared/resourceDescriptors';
import { UniqueValidator } from 'app/shared/validators/uniqueValidator';
import { RequiredValidator } from 'app/shared/validators/requiredValidator';

@Component({
  selector: 'app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./../site-config.component.scss']
})
export class AppSettingsComponent implements OnChanges, OnDestroy {
  public Resources = PortalResources;
  public groupArray: FormArray;

  private _resourceIdStream: Subject<string>;
  private _resourceIdSubscription: RxSubscription;
  public hasWritePermissions: boolean;
  public permissionsMessage: string;
  public showPermissionsMessage: boolean;

  private _busyState: BusyStateComponent;
  private _busyStateScopeManager: BusyStateScopeManager;

  private _saveError: string;

  private _requiredValidator: RequiredValidator;
  private _uniqueAppSettingValidator: UniqueValidator;

  private _appSettingsArm: ArmObj<any>;
  private _slotConfigNamesArm: ArmObj<SlotConfigNames>;

  public loadingFailureMessage: string;
  public loadingMessage: string;

  public newItem: CustomFormGroup;
  public originalItemsDeleted: number;

  @Input() mainForm: FormGroup;

  @Input() resourceId: string;
  private _slotConfigNamesArmPath: string;

  constructor(
    private _cacheService: CacheService,
    private _fb: FormBuilder,
    private _translateService: TranslateService,
    private _logService: LogService,
    private _authZService: AuthzService,
    siteTabComponent: SiteTabComponent
  ) {
    this._busyState = siteTabComponent.busyState;
    this._busyStateScopeManager = this._busyState.getScopeManager();

    this._resetPermissionsAndLoadingState();

    this.originalItemsDeleted = 0;

    this._resourceIdStream = new Subject<string>();
    this._resourceIdSubscription = this._resourceIdStream
      .distinctUntilChanged()
      .switchMap(() => {
        this._busyStateScopeManager.setBusy();
        this._saveError = null;
        this._appSettingsArm = null;
        this._slotConfigNamesArm = null;
        this.groupArray = null;
        this.newItem = null;
        this.originalItemsDeleted = 0;
        this._resetPermissionsAndLoadingState();
        this._slotConfigNamesArmPath =
          `${SiteDescriptor.getSiteDescriptor(this.resourceId).getSiteOnlyResourceId()}/config/slotConfigNames`;
        return Observable.zip(
          this._authZService.hasPermission(this.resourceId, [AuthzService.writeScope]),
          this._authZService.hasReadOnlyLock(this.resourceId),
          (wp, rl) => ({ writePermission: wp, readOnlyLock: rl })
        )
      })
      .mergeMap(p => {
        this._setPermissions(p.writePermission, p.readOnlyLock);
        return Observable.zip(
          Observable.of(this.hasWritePermissions),
          this.hasWritePermissions ?
            this._cacheService.postArm(`${this.resourceId}/config/appSettings/list`, true) : Observable.of(null),
          this.hasWritePermissions ?
            this._cacheService.getArm(this._slotConfigNamesArmPath, true) : Observable.of(null),
          (h, a, s) => ({ hasWritePermissions: h, appSettingsResponse: a, slotConfigNamesResponse: s })
        )
      })
      .do(null, error => {
        this._logService.error(LogCategories.appSettings, '/app-settings', error);
        this._setupForm(null, null);
        this.loadingFailureMessage = this._translateService.instant(PortalResources.configLoadFailure);
        this.loadingMessage = null;
        this.showPermissionsMessage = true;
        this._busyStateScopeManager.clearBusy();
      })
      .retry()
      .subscribe(r => {
        if (r.hasWritePermissions) {
          this._appSettingsArm = r.appSettingsResponse.json();
          this._slotConfigNamesArm = r.slotConfigNamesResponse.json();
          this._setupForm(this._appSettingsArm, this._slotConfigNamesArm);
        }
        this.loadingMessage = null;
        this.showPermissionsMessage = true;
        this._busyStateScopeManager.clearBusy();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resourceId']) {
      this._resourceIdStream.next(this.resourceId);
    }
    if (changes['mainForm'] && !changes['resourceId']) {
      this._setupForm(this._appSettingsArm, this._slotConfigNamesArm);
    }
  }

  ngOnDestroy(): void {
    if (this._resourceIdSubscription) {
      this._resourceIdSubscription.unsubscribe();
      this._resourceIdSubscription = null;
    }
    this._busyStateScopeManager.dispose();
  }

  private _resetPermissionsAndLoadingState() {
    this.hasWritePermissions = true;
    this.permissionsMessage = "";
    this.showPermissionsMessage = false;
    this.loadingFailureMessage = "";
    this.loadingMessage = this._translateService.instant(PortalResources.loading);
  }

  private _setPermissions(writePermission: boolean, readOnlyLock: boolean) {
    if (!writePermission) {
      this.permissionsMessage = this._translateService.instant(PortalResources.configRequiresWritePermissionOnApp);
    } else if (readOnlyLock) {
      this.permissionsMessage = this._translateService.instant(PortalResources.configDisabledReadOnlyLockOnApp);
    } else {
      this.permissionsMessage = "";
    }

    this.hasWritePermissions = writePermission && !readOnlyLock;
  }


  private _setupForm(appSettingsArm: ArmObj<any>, slotConfigNamesArm: ArmObj<SlotConfigNames>) {
    if (!!appSettingsArm && !!slotConfigNamesArm) {
      if (!this._saveError || !this.groupArray) {
        this.newItem = null;
        this.originalItemsDeleted = 0;
        this.groupArray = this._fb.array([]);

        this._requiredValidator = new RequiredValidator(this._translateService);
        this._uniqueAppSettingValidator = new UniqueValidator(
          "name",
          this.groupArray,
          this._translateService.instant(PortalResources.validation_duplicateError));

        const stickAppSettingNames = slotConfigNamesArm.properties.appSettingNames || [];

        for (let name in appSettingsArm.properties) {

          if (appSettingsArm.properties.hasOwnProperty(name)) {
            const group = this._fb.group({
              name: [
                name,
                Validators.compose([
                  this._requiredValidator.validate.bind(this._requiredValidator),
                  this._uniqueAppSettingValidator.validate.bind(this._uniqueAppSettingValidator)])],
              value: [appSettingsArm.properties[name]],
              isSlotSetting: [stickAppSettingNames.indexOf(name) !== -1]
            }) as CustomFormGroup;

            group._msExistenceState = 'original';

            this.groupArray.push(group);
          }

        }
      }

      if (this.mainForm.contains("appSettings")) {
        this.mainForm.setControl("appSettings", this.groupArray);
      }
      else {
        this.mainForm.addControl("appSettings", this.groupArray);
      }
    }
    else {
      this.newItem = null;
      this.originalItemsDeleted = 0;
      this.groupArray = null;
      if (this.mainForm.contains("appSettings")) {
        this.mainForm.removeControl("appSettings");
      }
    }

    this._saveError = null;
  }

  validate(): SaveOrValidationResult {
    let groups = this.groupArray.controls;

    // Purge any added entries that were never modified
    for (let i = groups.length - 1; i >= 0; i--) {
      let group = groups[i] as CustomFormGroup;
      if (group._msStartInEditMode && group.pristine) {
        groups.splice(i, 1);
        if (group === this.newItem) {
          this.newItem = null;
        }
      }
    }

    groups.forEach(group => {
      let controls = (<FormGroup>group).controls;
      for (let controlName in controls) {
        let control = <CustomFormControl>controls[controlName];
        control._msRunValidation = true;
        control.updateValueAndValidity();
      }
    });

    return {
      success: this.groupArray.valid,
      error: this.groupArray.valid ? null : this._validationFailureMessage()
    };
  }

  save(): Observable<SaveOrValidationResult> {
    let appSettingGroups = this.groupArray.controls;

    if (this.mainForm.contains("appSettings") && this.mainForm.controls["appSettings"].valid) {
      let appSettingsArm: ArmObj<any> = JSON.parse(JSON.stringify(this._appSettingsArm));
      appSettingsArm.properties = {};

      let slotConfigNamesArm: ArmObj<any> = JSON.parse(JSON.stringify(this._slotConfigNamesArm));
      delete slotConfigNamesArm.properties.connectionStringNames;
      slotConfigNamesArm.properties.appSettingNames = slotConfigNamesArm.properties.appSettingNames || [];
      let appSettingNames = slotConfigNamesArm.properties.appSettingNames as string[];

      // TEMPORARY MITIGATION: Only do PUT on slotConfiNames API if there have been changes.
      let appSettingNamesModified = false;

      for (let i = 0; i < appSettingGroups.length; i++) {
        if ((appSettingGroups[i] as CustomFormGroup)._msExistenceState !== 'deleted') {
          let name = appSettingGroups[i].value.name;

          appSettingsArm.properties[name] = appSettingGroups[i].value.value;

          if (appSettingGroups[i].value.isSlotSetting) {
            if (appSettingNames.indexOf(name) === -1) {
              appSettingNames.push(name);
              appSettingNamesModified = true;
            }
          }
          else {
            let index = appSettingNames.indexOf(name);
            if (index !== -1) {
              appSettingNames.splice(index, 1);
              appSettingNamesModified = true;
            }
          }
        }
      }

      return Observable.zip(
        this._cacheService.putArm(`${this.resourceId}/config/appSettings`, null, appSettingsArm),
        // TEMPORARY MITIGATION: Only do PUT on slotConfiNames API if there have been changes.
        appSettingNamesModified ? this._cacheService.putArm(this._slotConfigNamesArmPath, null, slotConfigNamesArm) : Observable.of(null),
        Observable.of(appSettingNamesModified),
        (a, s, m) => ({ appSettingsResponse: a, slotConfigNamesResponse: s, appSettingNamesModified: m })
      )
        .map(r => {
          this._appSettingsArm = r.appSettingsResponse.json();
          this._slotConfigNamesArm = r.appSettingNamesModified ? r.slotConfigNamesResponse.json() : this._slotConfigNamesArm;
          return {
            success: true,
            error: null
          };
        })
        .catch(error => {
          this._saveError = error._body;
          return Observable.of({
            success: false,
            error: error._body
          });
        });
    }
    else {
      let failureMessage = this._validationFailureMessage();
      this._saveError = failureMessage;
      return Observable.of({
        success: false,
        error: failureMessage
      });
    }
  }

  private _validationFailureMessage(): string {
    const configGroupName = this._translateService.instant(PortalResources.feature_applicationSettingsName);
    return this._translateService.instant(PortalResources.configUpdateFailureInvalidInput, { configGroupName: configGroupName });
  }

  deleteItem(group: FormGroup) {
    let groups = this.groupArray;
    let index = groups.controls.indexOf(group);
    if (index >= 0) {
      if ((group as CustomFormGroup)._msExistenceState === 'original') {
        this._deleteOriginalItem(groups, group);
      }
      else {
        this._deleteAddedItem(groups, group, index);
      }
    }
  }

  private _deleteOriginalItem(groups: FormArray, group: FormGroup) {
    // Keep the deleted group around with its state set to dirty.
    // This keeps the overall state of this.groupArray and this.mainForm dirty.
    group.markAsDirty();

    // Set the group._msExistenceState to 'deleted' so we know to ignore it when validating and saving.
    (group as CustomFormGroup)._msExistenceState = 'deleted';

    // Force the deleted group to have a valid state by clear all validators on the controls and then running validation.
    for (let key in group.controls) {
      const control = group.controls[key];
      control.clearAsyncValidators();
      control.clearValidators();
      control.updateValueAndValidity();
    }

    this.originalItemsDeleted++;

    groups.updateValueAndValidity();
  }

  private _deleteAddedItem(groups: FormArray, group: FormGroup, index: number) {
    // Remove group from groups
    groups.removeAt(index);
    if (group === this.newItem) {
      this.newItem = null;
    }

    // If group was dirty, then groups is also dirty.
    // If all the remaining controls in groups are pristine, mark groups as pristine.
    if (!group.pristine) {
      let pristine = true;
      for (let control of groups.controls) {
        pristine = pristine && control.pristine;
      }

      if (pristine) {
        groups.markAsPristine();
      }
    }

    groups.updateValueAndValidity();
  }

  addItem() {
    let groups = this.groupArray;
    this.newItem = this._fb.group({
      name: [
        null,
        Validators.compose([
          this._requiredValidator.validate.bind(this._requiredValidator),
          this._uniqueAppSettingValidator.validate.bind(this._uniqueAppSettingValidator)])],
      value: [null],
      isSlotSetting: [false]
    }) as CustomFormGroup;

    this.newItem._msExistenceState = 'new';
    this.newItem._msStartInEditMode = true;
    groups.push(this.newItem);
  }
}
