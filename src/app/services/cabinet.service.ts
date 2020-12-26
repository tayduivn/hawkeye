import { Injectable } from '@angular/core';
import { BaseDataService } from './base-data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CabinetService {
    constructor(private baseData: BaseDataService) {}

    dataPassCabinet(params: passCabinetParams): Observable<any> {
        return this.baseData.get({ url: '/task/generate_arraying_container_data', params: params });
    }
}

export interface passCabinetParams {
    apply_inspection_no: string;
    contract_no: string;
    sku: string;
    outer_box_size_height: string;
    outer_box_size_width: string;
    outer_box_size_length: string;
    bar_code: string;
    container_num: string;
    outer_gross_weight: string;
    outer_net_weight: string;
    factory_name: string;
    factory_address: string;
    factory_contracts: string;
    mobile_phone: string;
    schedule_user_name: string;
    purchaser_user_name: string;
}
