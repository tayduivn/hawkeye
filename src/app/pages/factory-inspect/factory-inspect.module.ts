import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FactoryInspectPage } from './factory-inspect.page';

const routes: Routes = [
  {
    path: '',
    component: FactoryInspectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FactoryInspectPage]
})
export class FactoryInspectPageModule {}
