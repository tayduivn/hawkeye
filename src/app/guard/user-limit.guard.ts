import { BaseDataService } from './../services/base-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserLimitService } from '../services/user-limit.service';
import { PageEffectService } from '../services/page-effect.service';

@Injectable({
    providedIn: 'root',
})
export class UserLimitGuard implements CanActivate {
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let stateName = state.url
            .substr(1, state.url.length - 1)
            .split('dashboard/')
            .join('');
        if (this.limitService.has(stateName)) {
            return this.limitService.has(stateName);
        } else {
            this.tips();
        }
    }

    tips() {
        this.effectCtrl.showAlert({
            header: '提示',
            backdropDismiss: false,
            message: '没有权限！',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.effectCtrl.clearEffectCtrl();
                    },
                },
            ],
        });
    }

    constructor(
        private limitService: UserLimitService,
        private baseData: BaseDataService,
        private effectCtrl: PageEffectService,
    ) {}
}
