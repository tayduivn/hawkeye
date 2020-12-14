import { Injectable } from '@angular/core';
import { BaseDataService } from './base-data.service';
import { Observable } from 'rxjs';
import { Response } from './inspection.service';
import { map } from 'rxjs/operators';
import { InspectAppInfo } from '../pages/examine-detail/examine-detail.component';

export interface AdviseParams {
    id: number;
    contents: string;
    img?: string;
    apply_inspection_no?: number;
    advise_img?: any;
}

export interface Advise {
    advise_img?: string;
    advise_video?: string;
    apply_inspection_no?: string;
    contents: string;
    created_at: string;
    id: number;
    inspection_task_pre_id?: number;
    path?: number;
    pid?: number;
    review_type?: string;
    son?: Advise[];
    updated_at?: string;
    user?: { id: number; name: string };
    user_id?: number;
    sku?:string
}

@Injectable({
    providedIn: 'root',
})
export class ExamineService {
    constructor(private baseData: BaseDataService) {}

    //获取验货审核内容
    getReviewAdviseData(
        apply_inspection_no: number,
    ): Observable<{
        data: Advise[];
        info: InspectAppInfo[];
        is_reviewer: boolean;
    }> {
        return this.baseData
            .get({
                url: '/task/get_inspection_task_review_advise_data',
                params: { apply_inspection_no },
            })
            .pipe(map(res => res.data));
    }

    //添加验货审核内容
    addReviewAdvise(params: AdviseParams): Observable<Response<Advise[]>> {
        return this.baseData.post({ url: '/task/add_inspection_task_review_advise_data', params });
    }

    //修改验货审核内容
    modifyReviewAdvise(params: AdviseParams): Observable<Response<null>> {
        return this.baseData.post({ url: '/task/edit_inspection_task_review_advise_data', params });
    }

    //删除验货审核内容
    deleteReviewAdvise(params: { id: number }): Observable<Response<Advise[]>> {
        return this.baseData.get({ url: '/task/del_inspection_task_review_advise_data', params });
    }

    //审核 添加总结 文字
    addReviewSummaryText(params: AdviseSummary) {
        return this.baseData.post({ url: '/task/add_inspection_task_review_summary_desc', params });
    }

    //审核 添加总结 图片/视频
    addReviewSummaryMedia(params: AdviseSummary) {
        return this.baseData.post({ url: '/task/add_inspection_task_review_summary_pic_video', params });
    }

    //删除 总结 图片/视频
    removeReviewSummaryMedia(params: AdviseSummary) {
        return this.baseData.post({ url: '/task/del_inspection_task_review_summary_pic_video', params });
    }

    //撤销验货申请功能 数据审核
    resetInspectTaskSku(params: { apply_inspection_no: string; contract_no: string; sku: string }) {
        return this.baseData.get({ url: '/task/reset_inspection_task_sku', params });
    }
}

export interface AdviseSummary {
    review_summary_desc?: string;
    apply_inspection_no: string;
    sku: string;
    id: number;
    contract_no?: string;
 
}
