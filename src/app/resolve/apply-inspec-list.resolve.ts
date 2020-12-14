import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InspectionService } from '../services/inspection.service';

@Injectable({
    providedIn: 'root',
})
export class ApplyInspecListReslove implements Resolve<any> {
    resolve(): any | Observable<any> | Promise<any> {
        return this.inspecCtrl.getApplyInspecList();
    }
    constructor(public inspecCtrl: InspectionService, public Router: Router) {}
}
