import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TaskDetailPage } from './task-detail.page';
import { OmissionPipe } from '../../pipe/omission.pipe';
import { PoListReslove } from '../../guard/po-list-reslove';
import { AccesslistPipe } from '../../pipe/accesslist.pipe';

const routes: Routes = [
    {
        path: 'task-detail/:tid/:fid',
        resolve: {
            // contracts: TaskReslove,   //sku-列表
            poList: PoListReslove,
        },
        component: TaskDetailPage,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [TaskDetailPage, OmissionPipe, AccesslistPipe],
})
export class TaskDetailPageModule {}
