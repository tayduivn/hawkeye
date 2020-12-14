import { GlobalRedoService } from './../../services/global-redo.service';
import { ModalOptions } from '@ionic/core';
import { BaseDataService } from './../../services/base-data.service';
import { PageEffectService } from './../../services/page-effect.service';
import { ModalController } from '@ionic/angular';
import { sku } from './../task-add/task-add.page';
import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { InspectionService } from 'src/app/services/inspection.service';
import { pagging } from 'src/app/component/pagination/pagination.component';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-inspec-list',
    templateUrl: './inspec-list.page.html',
    styleUrls: ['./inspec-list.page.scss'],
})
export class InspecListPage implements OnInit {
    public applyInspecList: [];
    public skuList: sku[];
    public data: any = {
        data: {},
    };
    public popupShow: 'cancel' | 'enter' = 'cancel';
    public pagging: pagging = {
        pageNum: 1,
        pageTotal: null,
    };
    statusArr: Array<any> = [];
    public getListParams: any = {
        page: 1,
        order_by: '',
        status: '',
        keywords: '',
        type: 'contract_no',
    };
    constructor(
        public baseData: BaseDataService,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        public userLimit: UserLimitService,
        private modalCtrl: ModalController,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 205) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getList();
    }

    getList(e?: any) {
        e && (this.getListParams.page = e.pageNum);
        this.inspectService.getdepartmentInspecList(this.getListParams).subscribe((data: any) => {
            this.data = data.data;
            this.applyInspecList = data.data.data;
            this.statusArr = data.status_arr;
            this.baseData.printDebug && console.log(data);
        });
    }

    getListByFactoryAddress(e: any) {
        this.getListParams.order_by = e.value;
        this.getListParams.page = 1;
        this.inspectService.getApplyInspecList(this.getListParams).subscribe((data: any) => {
            this.data = data.data;
            this.applyInspecList = data.data.data;
            this.baseData.printDebug && console.log(data);
        });
    }

    postDepartment(p: any) {
        this.inspectService.postDepartment({ id: p.id, status: 1 }).subscribe((data) => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                p.isPostDent = true;
            }
        });
    }

    popupEvent(e: any) {
        this.popupShow = e.type;
    }

    seeSku(p: any) {
        let option: ModalOptions = {
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            backdropDismiss: false,
            componentProps: { contract: p, showType: 'list' },
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
        }
        return type;
    }
}
