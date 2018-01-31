import { DashboardType } from 'app/tree-view/models/dashboard-type';
import { TreeViewInfo, SiteData } from './../../tree-view/models/tree-view-info';
import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-slots-shell',
    templateUrl: './slots-shell.component.html',
    styleUrls: ['./slots-shell.component.scss']
})
export class SlotsShellComponent implements OnDestroy {
    viewInfo: TreeViewInfo<SiteData>;
    swapTarget: string;

    private routeParamsSubscription: Subscription;
    constructor(translateService: TranslateService, route: ActivatedRoute) {

        this.routeParamsSubscription = route.params.subscribe(x => {
            this.viewInfo = {
                resourceId: `/subscriptions/${x['subscriptionId']}/resourceGroups/${x[
                    'resourceGroup'
                ]}/providers/Microsoft.Web/sites/${x['site']}` + (x['slot'] ? `/slots/${x['slot']}` : ``),
                dashboardType: DashboardType.none,
                node: null,
                data: null
            };

            if(x['destslot']) {
                this.swapTarget = x['destslot'];
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }
}