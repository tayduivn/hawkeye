import { GlobalRedoService } from './../../services/global-redo.service';
import { BaseDataService } from './../../services/base-data.service';
import { PageEffectService } from './../../services/page-effect.service';
import { sku } from './../task-add/task-add.page';
import { Component, OnInit } from '@angular/core';
import { InspectionService } from 'src/app/services/inspection.service';
import { pagging } from 'src/app/component/pagination/pagination.component';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { ModalOptions } from '@ionic/core';
import { sortObj } from 'src/app/component/sort/sort.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-apply-inspec-list',
    templateUrl: './apply-inspec-list.page.html',
    styleUrls: ['./apply-inspec-list.page.scss'],
})
export class ApplyInspecListPage implements OnInit {
    public applyInspectList: [] = [];
    applyNameArr: Array<{key: string,value: string}> = [{key:'全部',value:''}];
    public skuList: sku[];
    public data: any = {
        data: {},
    };
    statusArr: Array<any> = [];
    public popupShow: 'cancel' | 'enter' = 'cancel';
    public pagging: pagging = {
        pageNum: 1,
        pageTotal: null,
    };
    public getListParams: any = {
        page: 1,
        order_by: '',
        status: '',
        keywords: '',
        contract_no_order_by: '',
        type: 'contract_no',
    };
    funnels: Array<{ key: string; value: string }> = [
        {
            key: '默认',
            value: '',
        }
    ];
    constructor(
        public baseData: BaseDataService,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        public userLimit: UserLimitService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService
    ) {
        this.globalRedo.refresh.subscribe(res => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 204) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getList();
    }

    getList(e?: any) {
        console.log(this.getListParams.status);
        e && (this.getListParams.page = e.pageNum);
        this.inspectService.getApplyInspecList(this.getListParams).subscribe((data: any) => {
            this.data = data.data;
            this.applyInspectList = data.data.data;
            this.statusArr = data.status_arr;
            this.applyNameArr = [{key:'全部',value:''}];
            this.applyNameArr = this.applyNameArr.concat(data.apply_name_arr);
            this.baseData.printDebug && console.log(data);
        });
    }

    getListBySort(e: sortObj) {
        this.getListParams[e.name] = e.value;
        this.getList();
    }

    funnelSelected(e: any) {
        this.getListParams.type = 'apply_user';
        this.getListParams.keywords = e.value;
        this.getListBySearch();
    }

    getListByFactoryAddress(e: any) {
        this.getListParams.order_by = e.value;
        this.getListParams.page = 1;
        this.inspectService.getApplyInspecList(this.getListParams).subscribe((data: any) => {
            this.data = data.data;
            this.applyInspectList = data.data.data;
            this.baseData.printDebug && console.log(data);
        });
    }

    postDepartment(p: any) {
        this.inspectService.postDepartment({ id: p.id, status: 1 }).subscribe(data => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                p.isPostDent = true;
                this.ngOnInit();
            }
        });
    }
 
    popupEvent(e: any) {
        this.popupShow = e.type;
        this.baseData.printDebug && console.log(e);
    }

    seeSku(p: any) {
        let option: ModalOptions = {
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            backdropDismiss: false,
            componentProps: {
                contract: p,
                showType: 'list',
                applyInspectId: p.id,
                showCancel:
                    p.status_desc == '已分配人员' ||
                    p.status_desc == '已确认任务' ||
                    p.status_desc == '已通过验货' ||
                    p.status_desc == '未通过验货'
                        ? false
                        : true,
            },
        };
        this.effectCtrl.showModal(option);
    }

    cancelApply(p: any) {
        this.effectCtrl.showAlert({
            header: '提示',
            message: '确定要取消申请吗？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    role: 'enter',
                    handler: () => {
                        this.inspectService.cancelApplyInspec(p.id).subscribe((data: any) => {
                            console.log(data);
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: data.message,
                            });
                            if (data.status == 1) {
                                setTimeout(() => {
                                    this.getList();
                                }, 1000);
                            }
                        });
                    },
                },
            ],
        });
    }

    getListBySearch() {
        this.getListParams.page = 1;
        if (this.getListParams.type == '') {
            this.effectCtrl.clearEffectCtrl();
            this.msg.error('请选择搜索类型')
           
            return;
        }
        this.getList();
    }

    segmentChange() {
        if (this.getListParams.keywords) {
            this.getList();
        }
    }

    get chinaeseType() {
        let type: string = '';
        switch (this.getListParams.type) {
            case 'contract_no':
                type = '合同号';
                break;
            case 'manufacturer':
                type = '工厂名称';
                break;
            case 'factory_simple_address':
                type = '工厂地址';
                break;
            case 'apply_user':
                type = '申请人';
        }
        return type;
    }

    onChange(result: Date, p: any): void {
        this.inspectService
            .setApplyDate({
                apply_id: p.id,
                inspection_date: p.inspection_date,
                estimated_loading_time: p.estimated_loading_time,
            })
            .subscribe(res => {
                this.effectCtrl.showAlert({
                    message: res.message,
                });
            });
    }

    onOk(e: Date) {}
}
