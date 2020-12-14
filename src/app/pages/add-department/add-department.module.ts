import { ShareModule } from 'src/app/share/share.module';
import { PositionComponent } from './position/position.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddDepartmentPage } from './add-department.page';

const routes: Routes = [
    {
        path: 'add-department/:type/:did/:list/:utype', // type:'department' or 'position'     departmentId  or 'add'   list:'dep' or 'post'     list是从判断哪个列表上面进入的  utype:判断是新增还是更新
        component: AddDepartmentPage,
    },
    {
        path: 'position/:did',
        component: PositionComponent,
    },
];

@NgModule({
    imports: [CommonModule, ShareModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [AddDepartmentPage, PositionComponent],
})
export class AddDepartmentPageModule {}
