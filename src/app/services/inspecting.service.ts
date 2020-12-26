// 工厂考察接口文件
import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class InspectingService {
    constructor(public baseData: BaseDataService) {}
    // 获取考察工厂列表的接口
    getInspectFactoryList(params: FactoryListQueryInfo): Observable<any> {
        return this.baseData.get({
            url: '/factory/factory-inspect-list',
            params: params,
        });
    }

    // 获取工厂详情的接口
    getFactoryDetails(params: FactoryDetails): Observable<any> {
        return this.baseData.get({
            url: '/factory/factory-inspect-by-id',
            params,
        });
    }

    // 获取产品的列表
    getProductList(params: FactoryDetails): Observable<any> {
        return this.baseData.get({
            url: '/factory/factory-inspect-product-list',
            params,
        });
    }
    // 样品信息 /factory/factory-inspect-sample-list
    getSampleInfo(params: FactoryDetails): Observable<any> {
        return this.baseData.get({
            url: '/factory/factory-inspect-sample-list',
            params,
        });
    }

    // 工厂评估
    // /factory/factory-inspect-evaluate
    getAssessInfo(params: FactoryDetails): Observable<any> {
        return this.baseData.get({
            url: '/factory/factory-inspect-evaluate',
            params,
        });
    }
}
export interface FactoryListQueryInfo {
    name?: string; //考察对象
    start_time?: string; //开始时间
    end_time?: string; //结束时间
    page?: number; //请求页面的页码
    user_id?: number; //用户编号  //考察人员
    paginate?: number; //每一页的数据数量
}

export interface FactoryDetails {
    factory_id?: number; //工厂id
}
