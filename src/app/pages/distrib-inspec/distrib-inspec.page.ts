import { GlobalRedoService } from './../../services/global-redo.service';
import { PageEffectService } from './../../services/page-effect.service';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { InspectionService, distribFromParams } from 'src/app/services/inspection.service';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper/dist';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/core';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import 'ag-grid-enterprise';
import { DatePipe } from '@angular/common';
import { ConfirmedPopupBoxComponent } from 'src/app/component/confirmed-popupbox/confirmed-popupbox.component';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-distrib-inspec',
    templateUrl: './distrib-inspec.page.html',
    styleUrls: ['./distrib-inspec.page.scss'],
    providers: [DatePipe],
})
export class DistribInspecPage implements OnInit {
    tableWidth: number = 1660;
    tableLevelTwoWidth: number = 60;
    tableLevelThreeWidth: number = 90;

    currentTime: string = this.baseData.utilFn.Format('yyyy-MM-dd');
    inspecGroup: Array<any> = [];
    inspecUserList: Array<any> = [];
    swiperConfig: SwiperConfigInterface = {};
    public getListParams: any = {
        type: 'contract_no',
        keywords: '',
        order_by: '',
        inspection_username_order_by: '',
        page: 1,
    };
    currentHoverItem: any = {
        id: null,
    };
    updateParams: distribFromParams = {
        probable_inspection_date: [],
        inspection_group_id: null,
        user_id: [],
        desc: '',
    };

    private gridApi;
    sItemsItemsItem;
    private gridColumnApi;

    public columnDefs;
    public detailCellRendererParams;
    private rowData: [];
    tableTwoColSpan: number = 7;
    tableThreeColSpan: number = 2;
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
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 208) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getUserList();
        this.getinpectionGroup();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
        this.setTableWidth();
    }

    setTableWidth() {
        let table: Array<{ name: string; width: number; permission: any }> = [
            {
                name: '批次号',
                width: 100,
                permission: 'inspection-group-no',
            },
            {
                name: '最早可验货时间',
                width: 100,
                permission: 'earliest-inspection-time',
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
                name: '预计装柜时间',
                width: 100,
                permission: 'estimated-loading-time',
            },
            // {
            //     name: '合同操作',
            //     width: 250,
            //     permission: ['show-sku', 'show-detail', 'reset-contract'],
            // },
            {
                name: '选择验货时间',
                width: 240,
                permission: 'select-inspection-time',
            },
            {
                name: '验货人',
                width: 150,
                permission: 'inspector',
            },
            {
                name: '操作',
                width: 200,
                permission: ['reset-group', 'select-inspector', 'submit'],
            },
            {
                name: '工厂备注',
                width: 150,
                permission: 'factory-desc',
            },
        ];
        this.tableWidth = 450;
        this.tableLevelTwoWidth = 250;
        this.tableLevelThreeWidth = 250;
        this.tableTwoColSpan = 1;
        this.tableThreeColSpan = 1;
        table.forEach(td => {
            this.userLimit.has(td.permission, 35) && (this.tableWidth += td.width);
            !this.userLimit.has(td.permission,35) && console.log(td)
            if (
                td.name === '最早可验货时间' ||
                td.name === '工厂名称' ||
                td.name === '工厂地址' ||
                td.name === '验货SKU数' ||
                td.name === '预计装柜时间' ||
                td.name === '选择验货时间'
            ) {
                this.userLimit.has(td.permission, 35) && ++this.tableTwoColSpan;
                this.userLimit.has(td.permission, 35) && (this.tableLevelTwoWidth += td.width);
                if (td.name === '最早可验货时间' && this.userLimit.has(td.permission, 35)) {
                    this.tableLevelThreeWidth += td.width;
                    ++this.tableThreeColSpan;
                }
            }
        });

    }

    ionViewWillEnter() {}

    getinpectionGroup(e?: any) {
        e && (this.getListParams[e.name] = e.value);
        this.inspectService.getinpectionGroup(this.getListParams).subscribe((data: any) => {
            this.contracts = data;

            this.inspecGroup = data.data;
            this.inspecGroup.forEach(group => {
                group.inspec_users = [];
                group.apply_inspections.forEach(factory => {
                    if (group.info && group.info.length) {
                        group.info.forEach(info => {
                            if (factory.factory_name == info.factory_name) {
                                factory.early_date_start = info.date ? info.date.probable_inspection_date_start : null;
                                factory.early_date_end = info.date ? info.date.probable_inspection_date_end : null;
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
            this.baseData.printDebug && console.table(this.inspecGroup);
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
                            .subscribe(data => {
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
            case 'inspection_group_no':
                type = '批次号';
        }
        return type;
    }

    //表格
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.getinpectionGroup();
        setTimeout(function() {
            var rowCount = 0;
            params.api.forEachNode(function(node) {
                node.setExpanded(rowCount++ === 1);
            });
        }, 500);
    }

    cellClicked(e: any) {
        if (e.event.target.localName == 'ion-button') {
            if (e.event.target.innerText == '分配验货') {
                this.seeOrder(e.data);
                this.baseData.printDebug && console.log(e, '分配验货');
            } else {
                this.revokeTask(e.data, 'group');
                this.baseData.printDebug && console.log(e, '撤销验货');
            }
        }
    }

    setAllTipsHide(e: any) {
        if (e.target.className.indexOf('chip-text-tips') == -1) {
            this.inspecGroup.forEach(data => {
                data.apply_inspections.forEach(element => {
                    element.data.forEach(sElement => {
                        sElement.show_factory_tips = false;
                    });
                });
            });
        }
    }

    setItemTipsShow(e: any, p: any) {
        e.stopPropagation();
        p.show_factory_tips = true;
    }

    choiceInspecUser(p: any) {
        let inputs = [];
        this.inspecUserList.forEach(data => {
            inputs.push({
                name: data.name,
                type: 'checkbox',
                label: data.name,
                value: data.id,
                checked: false,
                handler: data => {
                    this.baseData.printDebug && console.log(data);
                },
            });
        });
        inputs.forEach(element => {
            p.inspec_users.forEach(userid => {
                if (userid == element.value) {
                    element.checked = true;
                }
            });
        });

        this.effectCtrl.showAlert({
            header: '选择验货人',
            inputs: inputs,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: (e: Array<number>) => {
                        p.user = [];
                        p.inspec_users = [];
                        e.forEach(d => {
                            this.inspecUserList.forEach(user => {
                                if (user.id == d) {
                                    p.user.push(user.name);
                                    p.inspec_users.push(user.id);
                                    p.user_can_change = 1;
                                }
                            });
                        });
                        this.preDistribInspec(p, 'choicePeople');
                    },
                },
            ],
        });
    }

    getUserList() {
        this.inspectService.getGroupUserList().subscribe((data: any) => {
            this.inspecUserList = data.data;
            this.baseData.printDebug && console.log(this.inspecUserList);
        });
    }

    preDistribInspec(item: any, type: 'startTime' | 'endTime' | 'desc' | 'choicePeople', sItem?: any) {
        this.updateParams.probable_inspection_date = [];
        this.updateParams.inspection_group_id = item.id;
        this.updateParams.user_id = item.inspec_users;
        if (type != 'choicePeople') {
            sItem.data.forEach(element => {
                this.updateParams.probable_inspection_date.push({
                    date_start: sItem.early_date_start,
                    date_end: sItem.early_date_end,
                    desc: sItem.desc,
                    apply_id: element.id,
                });
            });
        } else {
            item.apply_inspections.forEach(factory => {
                factory.data.forEach(element => {
                    if (factory.early_date_start) {
                        this.updateParams.probable_inspection_date.push({
                            date_start: factory.early_date_start,
                            date_end: factory.early_date_end,
                            desc: factory.desc,
                            apply_id: element.id,
                        });
                    }
                });
            });
        }

        this.inspectService.preDistribInspec(this.updateParams).subscribe(data => {
            this.baseData.printDebug && console.log(data);
        });
    }

    submit(p: any) {
        this.updateParams.probable_inspection_date = [];
        this.updateParams.inspection_group_id = p.id;
        this.updateParams.user_id = p.inspec_users;
        p.apply_inspections.forEach(factory => {
            factory.data.forEach(element => {
                if (factory.early_date_start) {
                    this.updateParams.probable_inspection_date.push({
                        date_start: factory.early_date_start,
                        date_end: factory.early_date_end,
                        desc: factory.desc,
                        apply_id: element.id,
                    });
                }
            });
        });

        this.baseData.printDebug && console.table(this.updateParams.probable_inspection_date);

        this.inspectService.selectGroupUser(this.updateParams).subscribe(data => {
            this.baseData.printDebug && console.log(data);
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                this.updateParams = {
                    probable_inspection_date: [],
                    inspection_group_id: null,
                    user_id: [],
                    desc: '',
                };
                setTimeout(() => {
                    this.getinpectionGroup();
                }, 1000);
            }
        });
    }
}
