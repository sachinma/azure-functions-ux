import { ScenarioIds } from './scenario-ids';
import { ScenarioCheckInput, ScenarioResult, Environment } from './scenario.models';
import i18n from '../../utils/i18n';

export class LinuxSiteEnvironment extends Environment {
  public name = 'LinuxSite';

  constructor() {
    super();

    const disabledResult: ScenarioResult = {
      status: 'disabled',
      data: i18n.t('featureNotSupportedForLinuxApps'),
    };

    this.scenarioChecks[ScenarioIds.enableAuth] = {
      id: ScenarioIds.enableAuth,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableMsi] = {
      id: ScenarioIds.enableMsi,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableBackups] = {
      id: ScenarioIds.enableBackups,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableNetworking] = {
      id: ScenarioIds.enableNetworking,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enablePushNotifications] = {
      id: ScenarioIds.enablePushNotifications,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.addConsole] = {
      id: ScenarioIds.addConsole,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.addSsh] = {
      id: ScenarioIds.addSsh,
      runCheck: () => ({ status: 'enabled' }),
    };

    this.scenarioChecks[ScenarioIds.enableAppServiceEditor] = {
      id: ScenarioIds.enableAppServiceEditor,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableExtensions] = {
      id: ScenarioIds.enableExtensions,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableLogStream] = {
      id: ScenarioIds.enableLogStream,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableProcessExplorer] = {
      id: ScenarioIds.enableProcessExplorer,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.enableTinfoil] = {
      id: ScenarioIds.enableTinfoil,
      runCheck: () => disabledResult,
    };

    this.scenarioChecks[ScenarioIds.vstsKuduSource] = {
      id: ScenarioIds.onedriveSource,
      runCheck: () => ({ status: 'disabled' }),
    };

    this.scenarioChecks[ScenarioIds.onedriveSource] = {
      id: ScenarioIds.onedriveSource,
      runCheck: () => ({ status: 'disabled' }),
    };

    this.scenarioChecks[ScenarioIds.dropboxSource] = {
      id: ScenarioIds.dropboxSource,
      runCheck: () => ({ status: 'disabled' }),
    };

    this.scenarioChecks[ScenarioIds.externalSource] = {
      id: ScenarioIds.externalSource,
      runCheck: () => ({ status: 'disabled' }),
    };
  }

  public isCurrentEnvironment(input?: ScenarioCheckInput): boolean {
    if (input && input.site) {
      return !!input.site.kind && input.site.kind.toLowerCase().indexOf('linux') > -1;
    }

    return false;
  }
}