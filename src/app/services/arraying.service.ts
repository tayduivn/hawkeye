import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sku } from '../pages/task-add/task-add.page';
import { BaseDataService } from './base-data.service';
import { map } from 'rxjs/operators';
import { InstallData } from '../pages/installed-cabinets/installed-cabinets.component';
import { environment } from 'src/environments/environment';

export interface Response<T> {
    status: number;
    message: string;
    data: T;
}

export interface Paging<T> {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}

export interface ArrayingContainerData {
    shipping_room: string;
    estimate_loading_time: string;
    bl_no: string;
    desc: string;
    id: number;
    charges: Array<Charge>;
}

export interface Charge {
    factory_code: string;
    factory_name: string;
    charge: number;
    desc: string;
}

export interface AlreadyArrayingData {
    shipping_rooms: Array<{ id: number; name: string; name_chinese: string }>;
    data: Paging<Array<ArrayingItem>>;
}

export interface ArrayingItem {
    id: number;
    name: string;
    shipping_room: string;
    arraying_container_num: number;
    truely_loading_time: string;
    estimated_arrival_time: string;
    on_board_date: string;
    estimate_loading_time: string;
    seal_no: string;
    container_no: string;
    bl_no: string;
    desc: string;
    status: number;
    created_at: string;
    updated_at: string;
    arraying_container_sku: sku[];
}

@Injectable({
    providedIn: 'root',
})
export class ArrayingService {
    public apiUrl: string = environment.apiUrl;
    constructor(private baseData: BaseDataService) {}

    /**
     * 获得待排柜sku列表
     */
    getWaitingContainerData(): Observable<Paging<sku[]>> {
        return this.baseData
            .get({ url: '/arrayingContainer/get_waiting_distribution_container_data' })
            .pipe(map(res => res.data));
    }

    /**
     * 提交排柜数据
     */
    postContainerData(skuIds: Array<{ arraying_container_num: number; id: number }>): Observable<Response<string>> {
        return this.baseData.post({
            url: '/arrayingContainer/post_distribution_container',
            params: { arraying_container_sku_arr: skuIds },
        });
    }

    /**
     * 获得已排柜数据
     */
    getAlreadyContainerData(page?: number): Observable<AlreadyArrayingData> {
        return this.baseData
            .get({ url: '/arrayingContainer/get_distribution_container_data', params: { page } })
            .pipe(map(res => res.data));
    }

    /**
     * 提交排柜清单数据
     */
    postArrayingContainerData(data: ArrayingContainerData): Observable<Response<any>> {
        return this.baseData.post({ url: '/arrayingContainer/post_arraying_container_data', params: data });
    }

    /**
     * 已装柜列表
     */
    getLoadingData(page?: number): Observable<Paging<ArrayingItem[]>> {
        return this.baseData
            .get({ url: '/arrayingContainer/get_loading_data', params: { page } })
            .pipe(map(res => res.data));
    }

    /**提交装柜数据 */
    postLoadingData(data: InstallData) {
        return this.baseData.post({ url: '/arrayingContainer/post_loading_data', params: data });
    }

    /**
     * 获取最终数据
     */
    getFinalData(params: { page: number; search_key: string; search_value: string }) {
        return this.baseData.get({ url: '/arrayingContainer/get_final_loading_data', params });
    }

    /**
     * 数据对比 提交装柜数据
     */
    postArrayDataForDataCompare(params: {data:Array<ParamForDataCompare>}): Observable<Response<null>> {
        return this.baseData.post({ url: '/task/generate_arraying_container_data', params });
    }

    /**
     * 查看待排柜总数
     */

    showArrayContainerTotal(params: ParamForArrayTotal) {
        return this.baseData.post({ url: '/arrayingContainer/count_distribution_container_data', params });
    }

    /**
     *
     * @param params
     */
    downExcel(params: { id_arr: Array<number>; type: string; start?: Date; end?: Date }) {
        let token: string = this.baseData.userInfo.api_token ? `${this.baseData.userInfo.api_token}` : undefined;
        let inspectDate: string = `&inspection_date_start=${params.start}&inspection_date_end=${params.end}`;
        let url = `${this.apiUrl}/arrayingContainer/down_excel_for_arraying_container?arr=${params.id_arr.join(
            ',',
        )}&api_token=${token}&type=${params.type}${params.start ? inspectDate : ''}`;
        location.href = url;
    }

    cancelArrayedData(params: {
        arraying_container_sku_id: number; //  批次里面的具体每个sku的所在数据的id
        name: string; //批次号(组名)
    }) {
        return this.baseData.post({ url: '/arrayingContainer/reset_arrayinged_container_data', params });
    }

    cancelInstalledData(params: { name: string }) {
        return this.baseData.post({ url: '/arrayingContainer/reset_loading_arraying_container_data', params });
    }

    cancelFinalCabinet(params: { name: string }) {
        return this.baseData.post({ url: '/arrayingContainer/reset_final_loading_data', params });
    }
}

export interface ParamForArrayTotal {
    arraying_container_sku_arr: Array<{
        arraying_container_num: number;
        id: number;
    }>;
}

export interface ParamForDataCompare {
    apply_inspection_no: string;
    contract_no: string;
    sku: string;
    outer_box_size_width: string;
    outer_box_size_height: string;
    outer_box_size_length: string;
    bar_code: string;
    container_num: number;
    outer_gross_weight: number;
    outer_net_weight: number;
    factory_name: string;
    factory_address: string;
    factory_contacts: string;
    mobil_phone: number;
    schedule_user_name: string;
    purchaser_user_name: string;
}
