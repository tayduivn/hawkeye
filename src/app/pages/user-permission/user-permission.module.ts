import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPermissionPage } from './user-permission.page';

const routes: Routes = [
    {
        path: 'user-permission',
        component: UserPermissionPage,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [UserPermissionPage],
})
export class UserPermissionPageModule {}
