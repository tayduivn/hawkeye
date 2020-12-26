import { LoginCanEnterGuard } from './guard/login-can-enter.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './guard/login.guard';
import { LoginCanLeaveGuard } from './guard/login-can-leave.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: './pages/login/login.module#LoginPageModule',
        canDeactivate: [LoginCanLeaveGuard],
        canActivate: [LoginCanEnterGuard],
        data: { uid: 1, useCache: false },
    },
    { path: '', loadChildren: './layout/layout/layout.module#LayoutPageModule' },
    {
        path: '',
        loadChildren: './pages/home/home.module#HomePageModule',
        canActivate: [LoginGuard],
        data: { uid: 2, useCache: false },
    },
    {
        path: '',
        loadChildren: './pages/welcome/welcome.module#WelcomePageModule',
        canActivate: [LoginGuard],
        data: { uid: 1, useCache: false },
    },
    {
        path: '**',
        redirectTo: '/welcome',
        pathMatch: 'full',
    },
  { path: 'factory-inspect', loadChildren: './pages/factory-inspect/factory-inspect.module#FactoryInspectPageModule' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
