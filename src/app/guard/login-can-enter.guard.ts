import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginCanEnterGuard implements CanActivate {
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let isLogin: boolean = sessionStorage.getItem('USERINFO') != null ? true : false;
        if (isLogin) {
            this.Router.navigate(['/welcome']);
        }
        return !isLogin;
    }
    constructor(private Router: Router) {}
}
