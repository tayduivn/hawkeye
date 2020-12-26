import { ComponentModule } from 'src/app/component/component.module';
import { AccInspecPage } from './acc-inspec/acc-inspec.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { InspectionPage } from './inspection/inspection.page';
import { inspectionObjPipe } from '../../pipe/inspection-obj.pipe';

import { InspectionReslove } from '../../guard/InspectionReslove.reslove';
import { InspFormRemindGuard } from './insp-form-remind.guard';
import { AccInspReslove } from '../../guard/acc-insp-reslove';
import { AccInspObjPipe } from '../../pipe/acc-insp-obj.pipe';
import { AccInspFormRemindGuard } from './acc-inspec-form-remind.guard';
import { DirectiveModule } from 'src/app/directive/directive.module';

const routes: Routes = [
    {
        path: 'inspection/sku/:sid/:sku/:cid/:type', //taskId  &&  sku  &&  contract_Id    && type  （type：判断是未完成还是完成的sku点击进入）
        resolve: {
            contracts: InspectionReslove,
        },
        canDeactivate: [InspFormRemindGuard],
        component: InspectionPage,
    },
    {
        path: 'inspection/acc/:sid/:cid',
        resolve: {
            accInsps: AccInspReslove,
        },
        canDeactivate: [AccInspFormRemindGuard],
        component: AccInspecPage,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, ComponentModule, DirectiveModule, IonicModule, RouterModule.forChild(routes)],
    providers: [InspFormRemindGuard],
    declarations: [InspectionPage, AccInspecPage, inspectionObjPipe, AccInspObjPipe],
})
export class InspectionPageModule {}
