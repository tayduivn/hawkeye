import { GlobalRedoService } from './../../services/global-redo.service';
import { UserLimitService } from './../../services/user-limit.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { InspectionService } from 'src/app/services/inspection.service';
import { ModalOptions } from '@ionic/core';
import { Router } from '@angular/router';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import 'ag-grid-enterprise';
import { DatePipe } from '@angular/common';
import { ConfirmedPopupBoxComponent } from 'src/app/component/confirmed-popupbox/confirmed-popupbox.component';
import { confirmedInspectComponent } from 'src/app/component/confirmed-inspect/confirmed-inspect.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-create-inspec-batch',
    templateUrl: './create-inspec-batch.page.html',
    styleUrls: ['./create-inspec-batch.page.scss'],
    providers: [DatePipe],
})
export class CreateInspecBatchPage implements OnInit {
    type: string;
    swiperConfig: SwiperConfigInterface = {};
    inspecGroup: Array<any> = [];
    public getListParams: any = {
        type: 'contract_no',
        keywords: '',
        order_by: '',
        inspection_group_no_order_by: '',
        page: 1,
    };

    private rowData: [];
    currentHoverItem: any = {
        id: null,
    };

    contracts: any = {
        last_page: 1,
    };
    tableWidth: number = 0;
    tableColSpanThreeWidth: number = 0;
    tableColSpanSixWidth: number = 0;
    tableColSpanTwoWidth: number = 0;
    twoColSpan: number = 0;
    sixColSpan: number = 0;
    threeColSpan: number = 0;
    constructor(
        private router: Router,
        public userLimit: UserLimitService,
        private datePipe: DatePipe,
        public baseData: BaseDataService,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 209) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getinpectionGroup();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
        this.setTableWidth();
    }

    setTableWidth() {
        this.tableWidth = 400;
        this.tableColSpanThreeWidth = 0;
        this.tableColSpanSixWidth = 200;
        this.tableColSpanTwoWidth = 0;
        this.twoColSpan = 0;
        this.threeColSpan = 0;
        this.sixColSpan = 0;
        let table: Array<{ name: string; width: number; permission: any }> = [
            {
                name: '验货人',
                width: 100,
                permission: 'inspector',
            },
            {
                name: '批次号',
                width: 120,
                permission: 'inspection-group-no',
            },
            {
                name: '最早可验货时间',
                width: 100,
                permission: 'earliest-inspection-time',
            },
            {
                name: '计划验货时间',
                width: 200,
                permission: 'inspection-time',
            },
            {
                name: '工厂名称',
                width: 180,
                permission: 'factory-name',
            },
            {
                name: '工厂地址',
                width: 100,
                permission: 'factory-address',
            },
            {
                name: '验货SKU数',
                width: 90,
                permission: 'inspection-sku-quantity',
            },
            {
                name: '备注',
                width: 100,
                permission: 'desc',
            },
            {
                name: '货号',
                width: 150,
                permission: 'sku',
            },
            {
                name: '货号备注',
                width: 200,
                permission: 'sku-desc',
            },
        ];
        table.forEach(td => {
            this.userLimit.has(td.permission, 42) && (this.tableWidth += td.width);

            if (td.name === '备注' || td.name === '货号' || td.name === '货号备注') {
                this.userLimit.has(td.permission, 42) && this.threeColSpan++;
                this.userLimit.has(td.permission, 42) && (this.tableColSpanThreeWidth += td.width);
                if (td.name === '货号' || td.name === '货号备注') {
                    this.userLimit.has(td.permission, 42) && this.twoColSpan++;
                    this.userLimit.has(td.permission, 42) && (this.tableColSpanTwoWidth += td.width);
                }
            }

            if (
                td.name === '最早验货时间' ||
                td.name === '计划验货时间' ||
                td.name === '工厂名' ||
                td.name === '工厂地址' ||
                td.name === '验货数'
            ) {
                this.userLimit.has(td.permission, 42) && this.sixColSpan++;
                this.userLimit.has(td.permission, 42) && (this.tableColSpanSixWidth += td.width);
            }
            
            !this.userLimit.has(td.permission,42) && console.log(td)
           
        });
        console.log(
            this.tableWidth,
            this.tableColSpanTwoWidth,
            this.tableColSpanThreeWidth,
            this.tableColSpanSixWidth
        )
    }

    getinpectionGroup(e?: any) {
        e && (this.getListParams[e.name] = e.value);
        this.inspectService.getDistributedList(this.getListParams).subscribe(data => {
            this.contracts = data;
            this.inspecGroup = data.data;
            this.inspecGroup.forEach(group => {
                group.apply_inspections.forEach(factory => {
                    if (group.info && group.info.length) {
                        group.info.forEach(info => {
                            if (factory.factory_name == info.factory_name) {
                                factory.date = info.date;
                                factory.desc = info.desc;
                            }
                        });
                    }

                    if (group.inspection_date && group.inspection_date.length) {
                        group.inspection_date.forEach(factoryInspectDate => {
                            if (factory.factory_name == factoryInspectDate.factory_name) {
                                factory.inspection_date = factoryInspectDate.inspection_date;
                            }
                        });
                    }
                });
            });
            this.baseData.printDebug && console.log(data.data);
        });
    }

    getListByPaging(e: any) {
        this.getListParams.page = e.pageNum;
        this.getinpectionGroup();
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

    seeOrder(p: any) {
        sessionStorage.setItem('DISTRIB-CONTRACT-INFO', JSON.stringify(p));
        this.router.navigate(['dashboard/distrib-to-user', p.id, 'list']);
    }

    revokeTask(p: any, type: 'group' | 'contract') {
        this.effectCtrl.showAlert({
            header: '提示',
            message: '确定要撤销此合同吗？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.inspectService.cancelDistribInspection(p.id).subscribe(data => {
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
            this.msg.error('请选择搜索类型');
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
            case 'user_name':
                type = '验货人';
        }
        return type;
    }

    enterReceiving(p: any) {
        let option: ModalOptions = {
            component: confirmedInspectComponent,
            componentProps: { group: p },
            cssClass: 'comfirm-confirmed',
        };

        this.effectCtrl.showModal(option, (data: any) => {
            this.getinpectionGroup();
        });
    }

    setItemTipsShow(e: any, p: any) {
        e.stopPropagation();
        p.show_factory_tips = true;
    }

    cellClicked(e: any) {
        if (e.event.target.localName == 'ion-button') {
            if (e.event.target.innerText == '确认验货') {
                this.enterReceiving(e.data);
                this.baseData.printDebug && console.log(e, '确认验货');
            } else {
                this.revokeTask(e.data, 'group');
                this.baseData.printDebug && console.log(e, '撤销验货');
            }
        }
    }
}
