import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataCompareService } from '../services/data-compare.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DataCompareDetailService {
    constructor(private dataCompare: DataCompareService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        let apply_inspection_no = route.paramMap.get('applyId');
        let sku = route.paramMap.get('sku');
        return this.dataCompare
            .getCompareDetail({
                apply_inspection_no: apply_inspection_no,
                sku: sku,
                contract_no: route.paramMap.get('contract_no')
            })
            .pipe(map((res) => res.data));
    }
}
