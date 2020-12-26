import { Injectable, Component } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginCanLeaveGuard implements CanDeactivate<Component> {
    canDeactivate(
        component: Component,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let isLogin: boolean = sessionStorage.getItem('USERINFO') != null ? true : false;
        return isLogin;
    }
}
