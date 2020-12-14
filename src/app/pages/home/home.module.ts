import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { LoginGuard } from 'src/app/guard/login.guard';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: 'home',
                component: HomePage,
                canActivate: [LoginGuard],
            },
        ]),
    ],
    declarations: [HomePage],
})
export class HomePageModule {}
