import { GlobalRedoService } from './../../services/global-redo.service';
import { PageEffectService } from './../../services/page-effect.service';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { InspectionService } from 'src/app/services/inspection.service';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper/dist';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/core';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import 'ag-grid-enterprise';
import { ConfirmedPopupBoxComponent } from 'src/app/component/confirmed-popupbox/confirmed-popupbox.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-created-batches',
    templateUrl: './created-batches.page.html',
    styleUrls: ['./created-batches.page.scss'],
})
export class CreatedBatchesPage implements OnInit {
    inspecGroup: Array<any> = [];
    swiperConfig: SwiperConfigInterface = {};
    public getListParams: any = {
        type: 'contract_no',
        keywords: '',
        order_by: '',
        page: 1,
    };
    currentHoverItem: any = {
        id: null,
    };
    contracts: any = {
        last_page: null,
    };
    constructor(
        public baseData: BaseDataService,
        public userLimit: UserLimitService,
        private effectCtrl: PageEffectService,
        private router: Router,
        private inspectService: InspectionService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 207) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getinpectionGroup();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }

    getinpectionGroup(e?: any) {
        e && (this.getListParams.order_by = e.value);
        this.inspectService.getCreatedBatches(this.getListParams).subscribe((data: any) => {
            data.data.forEach((group) => {
                group.apply_inspections.forEach((factory) => {
                    if (group.inspection_date && group.inspection_date.length) {
                        group.inspection_date.forEach((factoryInspectDate) => {
                            if (factory.factory_name == factoryInspectDate.factory_name) {
                                factory.inspection_date = factoryInspectDate.inspection_date;
                            }
                        });
                    }
                });
            });
            this.contracts = data;
            this.inspecGroup = data.data;

            this.baseData.printDebug && console.table(data.data);
        });
    }

    getListByPaging(e: any) {
        this.getListParams.page = e.pageNum;
        this.getinpectionGroup();
    }

    seeOrder(p: any) {
        sessionStorage.setItem('DISTRIB-CONTRACT-INFO', JSON.stringify(p));
        this.router.navigate(['dashboard/distrib-to-user', p.id, 'input']);
    }

    seeSku(p: any) { 
        let option: ModalOptions = {
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            componentProps: { contract: p, showType: 'list' },
        };
        this.effectCtrl.showModal(option);
    }

    seeDetail(p: any) {
        let option: ModalOptions = {
            component: ConfirmedPopupBoxComponent,
            componentProps: { contract: p },
            cssClass: 'see-confirmed',
        };
        this.effectCtrl.showModal(option);
    }

    revokeTask(p: any, type: 'group' | 'contract') {
        this.effectCtrl.showAlert({
            header: '提示',
            message: `确定要撤销此${type == 'group' ? '组' : '合同'}吗？`,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.inspectService
                            .cancelInspectionGroup(type == 'group' ? p.id : p.id, type)
                            .subscribe((data) => {
                                this.effectCtrl.showAlert({
                                    header: '提示',
                                    message: data.message,
                                });
                                if (data.status == 1) {
                                    this.getinpectionGroup();
                                }
                            });
                    },
                },
            ],
        });
    }

    getListBySearch() {
        if (this.getListParams.type == '') {
            this.effectCtrl.clearEffectCtrl();
            this.msg.error('请选择搜索类型')
            return;
        }
        this.getinpectionGroup();
    }

    segmentChange() {
        if (this.getListParams.keywords) {
            this.getinpectionGroup();
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
            case 'inspection_group_no':
                type = '批次号';
        }
        return type;
    }

    setAllTipsHide(e: any) {
        if (e.target.className.indexOf('chip-text-tips') == -1) {
            this.inspecGroup.forEach((data) => {
                data.apply_inspections.data.forEach((element) => {
                    element.show_factory_tips = false;
                });
            });
        }
    }

    setItemTipsShow(e: any, p: any) {
        e.stopPropagation();
        p.show_factory_tips = true;
    }
}
