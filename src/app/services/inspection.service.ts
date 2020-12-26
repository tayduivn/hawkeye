import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { accessOfTaskAndFac } from 'src/app/pages/task-detail/task-detail.page';
import { project } from './task.service';

@Injectable({
    providedIn: 'root',
})
export class InspectionService {
    constructor(public baseData: BaseDataService) {}
    // Observable  返回的值是被观察的对象  才能用subscribe去订阅  返回值的类型不固定  所以需要用any 冒号后面是传递过来的参数需要实现怎样的接口  这是对类型进行的限制
    submitData(uploadData: uploadData): Observable<any> {
        //sku  提交
        return this.baseData.post({
            url: '/task/task-inspection-post',
            params: uploadData,
        });
    }

    applyInspec(uploadData: applyInspsc): Observable<any> {
        return this.baseData.post({
            url: '/schedule/apply-inspection',
            params: uploadData,
        });
    }

    submitDataAcc(accUpload: Array<accessOfTaskAndFac>): Observable<any> {
        return this.baseData.post({
            url: '/task/task-inspection-acc-post',
            params: accUpload,
        });
    }

    getContractList(): Observable<any> {
        return this.baseData.get({ url: '/contracts/get-contracts-for-api' });
    }

    updateStatus(): Observable<any> {
        return this.baseData.get({ url: '/contracts/update-contracts-status' }, true);
    }

    getApplyInspecList(params?: {
        page: number;
        order_by: '' | 'desc' | 'asc';
        contract_no_order_by?: '' | 'desc' | 'asc';
    }): Observable<any> {
        //申请验货列表
        return this.baseData.get({
            url: '/schedule/apply-inspection-list',
            params: params,
        });
    }

    getdepartmentInspecList(params?: { page: number; order_by: '' }): Observable<any> {
        //验货列表
        return this.baseData.get({
            url: '/schedule/apply-department-list',
            params: params,
        });
    }

    postDepartment(department: department): Observable<any> {
        return this.baseData.post({
            url: '/schedule/post-inspection-department',
            params: department,
        });
    }

    getArrangeInspecList(params?: any): Observable<any> {
        //安排验货列表
        return this.baseData.get({
            url: '/inspection/inspections_group_list',
            params,
        });
    }

    setInspecGroup(params: setInspecGroupParams): Observable<any> {
        return this.baseData.post({
            url: '/inspection/distribute_groups',
            params: params,
        });
    }

    getinpectionGroup(params?: any): Observable<any> {
        let param = params ? params : {};
        return this.baseData.get({
            url: '/inspection/inspections_group',
            params: param,
        });
    }

    selectGroupUser(params: distribFromParams): Observable<any> {
        return this.baseData.post({
            url: '/inspection/distribute_inspections',
            params: params,
        });
    }

    preDistribInspec(params: distribFromParams): Observable<any> {
        //分配验货预处理
        return this.baseData.post({
            url: '/inspection/pre_distribute_inspections',
            params,
        });
    }

    getGroupUserList(): Observable<any> {
        return this.baseData.get({
            url: '/inspection/select_group_useranddate_list',
        });
    }

    getDistributedList(params?: any): Observable<any> {
        let param = params ? params : {};
        return this.baseData.get({
            url: '/inspection/select_distributed_list',
            params: param,
        });
    }

    cancelApplyInspec(id: number): Observable<any> {
        //取消验货
        return this.baseData.get({
            url: '/inspection/reset_apply_inspection',
            params: { id: id },
        });
    }

    cancelInspectionGroup(id: number, type: 'group' | 'contract'): Observable<any> {
        //撤销验货组 （数据回验货批次）
        let params = {},
            key = type == 'contract' ? 'apply_id' : 'inspection_group_id';
        params[key] = id;
        return this.baseData.get({
            url: '/inspection/reset_inspection_group',
            params: params,
        });
    }

    cancelDistribInspection(id: number): Observable<any> {
        //已分配撤销
        return this.baseData.get({
            url: '/inspection/reset_distribute_inspections',
            params: { inspection_group_id: id },
        });
    }

    cancelExamineInspection(id: number): Observable<any> {
        return this.baseData.get({
            url: '/inspection/reset_confirmed_inspection',
            params: { inspection_group_id: id },
        }); //已确认撤销
    }

    dragSortOfList(params: any): Observable<any> {
        return this.baseData.post({
            url: '/inspection/update_inspections_group_sort',
            params: params,
        });
    }

    confirmationOfReceipt(params: { inspection_group_id: number }): Observable<any> {
        return this.baseData.get({
            url: '/inspection/confirm_inspection',
            params: params,
        });
    }

    getConfirmedTask(params?: any): Observable<any> {
        return this.baseData.get({
            url: '/inspection/confirmed_inspection_task',
            params: params,
        });
    }

    getCreatedBatches(params: any): Observable<any> {
        return this.baseData.get({
            url: '/inspection/distributed_group_list',
            params: params,
        });
    }

    generateInspecNo() {
        return this.baseData.get({
            url: '/inspection/generate_inspection_group_no',
        });
    }

    getInspecionTask(): Observable<any> {
        return this.baseData.get({ url: '/inspection/get_inspection_task_data' });
    }

    inspecerSetting(params: any): Observable<any> {
        return this.baseData.post({
            url: '/inspection/pre_inspection_task',
            params: params,
        });
    }

    getInspecTaskList(): Observable<any> {
        return this.baseData.get({ url: '/inspection/inspection_task_list' });
    }

    setApplyDate(params: {
        apply_id: number;
        inspection_date: string;
        estimated_loading_time: string;
    }): Observable<any> {
        return this.baseData.post({
            url: '/schedule/edit_apply_inspection',
            params: params,
        });
    }

    applyInspectModifyDesc(params: { sku: string; apply_id: number; temporary_description: string }): Observable<any> {
        return this.baseData.post({
            url: '/schedule/add_apply_inspection_temporary_desc',
            params: params,
        });
    }

    skuCancelInspect(sku: string, apply_id: number) {
        return this.baseData.get({ url: '/inspection/reset_apply_inspection_sku', params: { sku: sku, id: apply_id } });
    }

    generateTaskGroup(params: GenerateTaskParams): Observable<Response<any>> {
        return this.baseData.post({
            url: '/inspection/generate_confirmed_inspection_task_to_group',
            params: { group_name: params.group_name, inspection_group_id_arr: params.inspection_group_id_arr },
        });
    }

    /**
     * 退出组
     */
    delGroupForTask(params: { group_name: string; id: string }): Observable<Response<any>> {
        return this.baseData.get({
            url: '/inspection/del_group_for_confirmed_inspection_task',
            params: { group_name: params.group_name, inspection_group_id: params.id },
        });
    }

    /**
     * 获取合并的工厂 和合同
     */
    getMergeTaskData() {
        return this.baseData.get({
            url: '/inspection/get_confirmed_factory_data',
        });
    }

    /**
     * 提交合并的sku数据
     */
    submitMergeData(params: MergeTaskParams) {
        return this.baseData.post({
            url: '/inspection/merge_confirmed_data',
            params,
        });
    }

    /**
     * 撤销验货
     */
    revokeInspect(params: { apply_id: number; sku: string }) {
        return this.baseData.get({
            url: '/inspection/reset_apply_inspection_sku',
            params,
        });
    }
}

export interface Response<T> {
    data: T;
    status: number;
    message: string;
}

export interface MergeTaskParams {
    sku_info: Array<{ apply_inspection_no: string; contract_no: string; sku: string }>;
    probable_inspection_date: Array<string>;
    inspection_user_id_arr: Array<number>;
    desc: string;
}

export interface GenerateTaskParams {
    group_name: string;
    inspection_group_id_arr: Number[] | string;
}

export interface department {
    id: number;
    status: number;
}

export interface AResponse<T> {
    b: T;
}

export interface b {
    as: string;
}

export interface uploadData {
    type?: string;
    contract_id: number | string;
    data?: project;
    sku?: string;
    task_id: string | number;
    parentSku?: string;
}

export interface applyInspsc {
    contract_id: number;
    content: any;
    inspection_date: string;
    is_new_factory: any;
    estimated_loading_time: String;
}

export interface setInspecGroupParams {
    inspection_group_name: string;
    contents: Array<number>;
    inspection_group_no: string;
}

export interface distribFromParams {
    inspection_group_id: number;
    user_id: Array<number>;
    probable_inspection_date: Array<{
        date_start: string;
        date_end: string;
        apply_id: number;
        desc?: string;
        contract_desc?: string;
    }>;
    desc: string;
}
