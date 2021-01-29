// 工厂考察接口文件
import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class reimbursement {
    constructor(public baseData: BaseDataService) {}
    // 获取列表接口
    getList(params): Observable<any> {
        return this.baseData.get({
            url: '/travel/get_travel_reimbursement_list',
            params,
        });
    }

    // 获取详情
    getDetails(params): Observable<any> {
        return this.baseData.get({
            url: '/travel/get_travel_reimbursement_details',
            params,
        });
    }

    // 获取前置数据
    getPreData(): Observable<any> {
        return this.baseData.get({
            url: '/travel/get_preposition_data',
        });
    }

    // 提交审批结果
    postExamine(params): Observable<any> {
        return this.baseData.post({
            url: '/travel/travel_reimbursement_approval',
            params,
        });
    }
}
