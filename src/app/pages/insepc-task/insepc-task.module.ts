import { ComponentModule } from './../../component/component.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InsepcTaskPage } from './insepc-task.page';
import { UserLimitGuard } from 'src/app/guard/user-limit.guard';
import { ShareModule } from 'src/app/share/share.module';
import { InsepcContractComponent } from './insepc-contract/insepc-contract.component';
import { InspecTaskMobileComponent } from './inspec-task-mobile/inspec-task-mobile.component';

const routes: Routes = [
    {
        path: 'insepc-task',
        // component: baseData.is_Inspector ? InsepcTaskPage : InspecTaskMobileComponent,
        component: InsepcTaskPage,
        canActivate: [UserLimitGuard],
    },
    {
        path: 'insepc-sss',
        component: InspecTaskMobileComponent,
        canActivate: [UserLimitGuard],
    },
    {
        path: 'insepc-contract',
        component: InsepcContractComponent,
        canActivate: [UserLimitGuard],
    },
    {},
];

@NgModule({
    imports: [CommonModule, ComponentModule, ShareModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [InsepcTaskPage, InsepcContractComponent, InspecTaskMobileComponent],
})
export class InsepcTaskPageModule {}
