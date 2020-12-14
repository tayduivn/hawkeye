import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TaskAddPage } from './task-add.page';

const routes: Routes = [
    {
        path: 'task-add',
        component: TaskAddPage,
    },
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [TaskAddPage],
})
export class TaskAddPageModule {}
