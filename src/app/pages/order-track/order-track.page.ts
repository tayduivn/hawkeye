import { GlobalRedoService } from './../../services/global-redo.service';
import { UserLimitService } from './../../services/user-limit.service';
import { BaseDataService } from './../../services/base-data.service';
import { InspectionService } from 'src/app/services/inspection.service';
import { TaskService, contractListParams } from '../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { contracts } from '../../services/task.service';
import { PageEffectService } from '../../services/page-effect.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { ModalOptions } from '@ionic/core';
import { NzMessageService } from 'ng-zorro-antd';
import { contract } from '../task-add/task-add.page';

@Component({
    selector: 'app-order-track',
    templateUrl: './order-track.page.html',
    styleUrls: ['./order-track.page.scss'],
})
export class OrderTrackPage implements OnInit {
    start_time: string;
    drawerType: string = '';
    end_time: string;
    drawerVisible = false; //进度排除项 框 显示/隐藏

    listOfName = [
        { text: '是', value: '1' },
        { text: '否', value: '2' },
    ];

    contracts: contracts = {
        data: {
            data: [],
        },
        status: null,
        message: '',
    };
    config: SwiperConfigInterface = {};
    currentContract: any; //当前选中的contract
    taskList: any;
    factoryId: number;
    popupShow: string = 'cancel';
    globalListActive: any = null;
    getListParams: contractListParams = {
        page: 1,
        type: this.baseData.userInfo.department == 'manager' ? 'contract_no' : 'create_user',
        keywords: '',
        is_update: '0',
        start_time: '',
        end_time: '',
        order_sign: '',
        order_progress: '',
        order_delivery: '',
        is_delay_order: '',
        is_out_shedule: '',
        break_update: '',
    };
    loading: boolean;

    get chinaeseType() {
        let type: string = '';
        switch (this.getListParams.type) {
            case 'create_user':
                type = '跟单人';
                break;
            case 'contract_no':
                type = '合同号';
                break;
            case 'manufacturer':
                type = '工厂名称';
                break;
            case 'sku':
                type = 'sku';
        }
        return type;
    }

    constructor(
        private taskService: TaskService,
        private effectCtrl: PageEffectService,
        private inspecCtrl: InspectionService,
        public baseData: BaseDataService,
        public userLimit: UserLimitService,
        private Router: Router,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 201) {
                this.ngOnInit();
            }
        });
    }

    clipboardData(e: any) {}

    ngOnInit() {
        this.taskService.getContractList(this.getListParams).subscribe((data: any) => {
            this.contracts = data;
            this.baseData.printDebug && console.log(this.contracts);
        });
        this.config = this.baseData.utilFn.getSwiperPublicConfig();
    }

    ionViewWillEnter() {}

    choice(i: number) {
        this.factoryId = i;
    }

    delayTrack(p: any) {
        this.taskService.delayTrack(p.id).subscribe(data => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                p.delay_track = 1;
            }
        });
    }

    toggleTrack(p: any) {   
        if (p.delay_track) {
            this.recoveryDelay(p);
        } else this.delayTrack(p);
    }

    recoveryDelay(p: any) {
        this.taskService.recoveryDelay(p.id).subscribe(data => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                p.delay_track = 0;
            }
        });
    }

    toDetail(type: string, id: number) {
        this.Router.navigate(['dashboard/track-detail', type, id]);
    }

    getListBySearch() {
        this.getListParams.page = 1;
        if (this.getListParams.type == '') {
            this.effectCtrl.clearEffectCtrl();
            this.msg.error('请选择搜索类型');

            return;
        }
        this.getList();
    }

    getList() {
        this.loading = true;
        this.start_time && (this.getListParams.start_time = String(new Date(this.start_time).getTime()));
        this.end_time && (this.getListParams.end_time = String(new Date(this.end_time).getTime()));
        this.taskService.getContractList(this.getListParams).subscribe(data => {
            this.contracts = data;
            this.loading = false;
            this.baseData.printDebug && console.log(data);
        });
    }

    getListByPaging(e: number) {
        this.getListParams.page = e;
        this.getList();
    }

    showSkuInfo(p: contract){
        this.drawerType = 'skuInfo';
        this.currentContract = p
        console.log(p)
    }

    getListByFilter(e, type: string) {
        this.getListParams[type] = e ? e : '';
        this.getList();
    }

    getListBySort(sort: { key: string; value: string }) {
        this.getListParams.page = 1;
        this.getListParams[sort.key] = sort.value ? sort.value.substr(0, sort.value.length - 3) : null;
        this.getList();
    }

    getListByTime() {
        // console.log(this.getListParams);return
        if (this.getListParams.is_update != '0') {
            if (this.start_time && this.end_time) {
                if (new Date(this.end_time).getTime() < new Date(this.start_time).getTime()) {
                    this.effectCtrl.showAlert({
                        header: '提示',
                        message: '结束时间不能小于开始时间哦',
                    });
                    return;
                }
                this.getListParams.page = 1;
                this.getList();
            }
        } else {
            this.start_time = this.end_time = '';
            this.getListParams.page = 1;
            this.getList();
        }
    }

    toHistory(id: number) {
        this.Router.navigate(['/dashboard/order-track/history', id]);
    }

    ionViewCanLeave() {
        this.effectCtrl.clearEffectCtrl();
    }

    applyInsp(p: any) {
        this.currentContract = p;
        let option: ModalOptions = {
            component: CustomPopupComponent,
            backdropDismiss: false,
            componentProps: { contract: p, showType: 'input' },
        };
        this.effectCtrl.showModal(option, (data: any) => {
            this.popupEvent(data);
        });
    }

    popupEvent(e: any) {
        let content = [];
        e.data.content.forEach((sku: any) => {
            if (sku.quantity && sku.quantity != 0) {
                content.push(sku);
            }
        });
        if (content.length == 0) {
            this.effectCtrl.showAlert({
                header: '提示',
                message: '请完善表单喔！',
            });
            return;
        }
        this.inspecCtrl
            .applyInspec({
                contract_id: this.currentContract.id,
                content: content,
                is_new_factory: e.data.is_new_factory,
                estimated_loading_time: e.data.estimated_loading_time,
                inspection_date: e.data.inspection_date,
            })
            .subscribe(data => {
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: data.message,
                    buttons: [
                        {
                            text: '去申请列表',
                            handler: () => {
                                this.Router.navigate(['dashboard/apply-inspc-list']);
                            },
                        },
                    ],
                });
            });
    }

    segmentChange() {
        if (this.getListParams.keywords) {
            this.getList();
        }
    }

    /**
     *  进度排除项
     */
    openDrawer(s: string) {
        //进度排除项
        this.drawerType = s;
    }

    closeDrawer(): void {
        //关闭进度排除项框
        this.drawerType = '';
    }

    drawerEmit(e: any) {
        this.drawerVisible = e;
    }

    progressUpdate(e: boolean) {
        this.drawerType = '';
        this.getList();
    }   
    currentSku: string = '';

    multiApply(){
        this.taskService.multiApplyInspect({sku:this.getListParams.keywords})
            .subscribe(res => {
                console.log(res)
            })
    }
}
