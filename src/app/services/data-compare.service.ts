import { Paging } from './arraying.service';
import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from './inspection.service';
import { environment } from 'src/environments/environment';

export interface GetCompareParams {
    apply_inspection_no: string;
    sku: string;
    contract_no: string;
}

export interface GetHistoryParams {
    type: string;
    sku: string;
    apply_inspection_no: string;
}

export interface GetBasicDataParam {
    sort_key?: string;
    sort_value?: string;
    search_key?: 'sku' | 'factory_name';
    search_value?: string;
    is_passed?: string;
    page?: number;
    inspection_date_start?: string;
    inspection_date_end?: string;
}

@Injectable({
    providedIn: 'root',
})
export class DataCompareService {
    public apiUrl: string = environment.apiUrl;
    constructor(public baseData: BaseDataService) {}

    getCompareBasicList(
        params?: GetBasicDataParam,
    ): Observable<
        Response<{ review_permission: boolean; review_status: { key: number; value: string }[]; data: Paging<any> }>
    > {
        return this.baseData.get({ url: '/task/get_compare_apply_inspection_data_pc', params });
    }

    getCompareDetail(params: GetCompareParams): Observable<any> {
        return this.baseData.get({ url: '/task/get_compare_sku_data_for_admin', params: params });
    }

    getCompareFactoryAndContractData(params: { apply_inspection_no: string }): Observable<any> {
        return this.baseData.get({ url: '/task/get_compare_data_for_factory_and_contract', params: params });
    }

    getCompareForHistory(params: GetHistoryParams): Observable<any> {
        return this.baseData.get({ url: '/task/get_inspection_task_old_data', params: params });
    }

    taskDataReview(params: { apply_inspection_no: string; review_status: number; sku?: string; contract_no: string }) {
        return this.baseData.get({ url: '/task/inspection_task_review', params });
    }

    /**
     * 建议审核状态
     */
    taskAdviceDataReview(params: { apply_inspection_no: string; recommend_status: number; sku: string }) {
        return this.baseData.get({ url: '/task/inspection_task_review_for_recommend', params });
    }

    downloadInspectImage(apply_inspection_no: string): Observable<any> {
        return this.baseData.get({ url: '/get_inspection_task_reports_for_image', params: { apply_inspection_no } });
    }

    downloadInspectVideo(apply_inspection_no: string): Observable<any> {
        return this.baseData.get({ url: '/get_inspection_task_reports_for_video', params: { apply_inspection_no } });
    }

    getResetContractList(params: { apply_inspection_no: string; sku: string }) {
        return this.baseData.get({ url: '/task/get_reset_contract_list', params });
    }

    /**
     *
     * @param params
     */
    downExcel(params: { id_arr: Array<number>; start?: string; end?: string }) {
        let token: string = this.baseData.userInfo.api_token ? `${this.baseData.userInfo.api_token}` : undefined;
        let inspectDate: string = `&inspection_date_start=${params.start}&inspection_date_end=${params.end}`;
        let url = `${
            this.apiUrl
        }/task/down_compare_apply_inspection_data_excel?arr=${params.id_arr.join(
            ',',
        )}&api_token=${token}${params.start ? inspectDate : ''}`;
        location.href = url;
    }
}
