import { GlobalRedoService } from './../../services/global-redo.service';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { InspectionService } from 'src/app/services/inspection.service';
import { ModalOptions } from '@ionic/core';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ConfirmedPopupBoxComponent } from 'src/app/component/confirmed-popupbox/confirmed-popupbox.component';
import { GenerateTaskParams } from '../../services/inspection.service';
import { NzMessageService } from 'ng-zorro-antd';
import { EditTaskComponent } from 'src/app/component/edit-task/edit-task.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { sku } from '../task-add/task-add.page';
import { UserLimitService } from 'src/app/services/user-limit.service';

@Component({
    selector: 'app-examine-inspec',
    templateUrl: './examine-inspec.page.html',
    styleUrls: ['./examine-inspec.page.scss'],
})
export class ExamineInspecPage implements OnInit {
    grouping: boolean = false;
    swiperConfig: SwiperConfigInterface = {};
    confirmedGroup: Array<any> = [];
    getConfirmedParams: any = {
        order_by: '',
        group_name: '',
        page: 1,
        select_all: false,
        page_total: 20,
        search_key: '',
        search_value: '',
    };
    date: Date;
    weekDate: any[] = [];
    contracts: any = {
        last_page: 1,
    };
    generateTaskGroupName: string = '';
    keywords: FormControl = new FormControl('');
    searchVal: FormControl = new FormControl('');

    tableWidth: number = 0;
    tableTenWidth: number = 0;
    tableSevenWidth: number = 0;
    tableThreeWidth: number = 0;
    tableTwoWidth: number = 0;
    tenColSpan: number = 10;
    sevenColSpan: number = 7;
    threeColSpan: number = 3;
    twoColSpan: number = 0;

    constructor(
        public baseData: BaseDataService,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService,
        public userLimit: UserLimitService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2010) {
                this.ngOnInit();
                this.getConfirmedParams.group_name = '';
            }
        });
    }

    doGroup() {
        if (this.grouping) {
            if (!this.generateTaskGroupName) {
                this.msg.error('请选择时间');
            } else {
                let params: GenerateTaskParams = {
                    group_name: this.generateTaskGroupName,
                    inspection_group_id_arr: [],
                };
                this.confirmedGroup
                    .filter(x => x.isSelectedForFont)
                    .map(e => (params.inspection_group_id_arr as Array<number>).push(e.id));
                this.inspectService.generateTaskGroup(params).subscribe(res => {
                    if (res.status) this.msg.success('分组成功');

                    this.grouping = false;
                });
            }
        }

        this.grouping = true;
    }

    pagingTotalChange(e: number) {
        this.getConfirmedTask({ name: 'page_total', value: e });
    }

    ngOnInit() {
        this.inspectService.getConfirmedTask().subscribe((data: any) => {
            this.confirmedGroup = data.data;
            this.contracts = data;
            this.confirmedGroup.forEach(group => {
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
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
        let key = this.keywords.valueChanges.pipe(debounceTime(500));
        let sType = this.searchVal.valueChanges.pipe(debounceTime(500));

        combineLatest(key, sType).subscribe(res => {
            this.getConfirmedParams.page = 1;
            this.getConfirmedTask([
                { name: 'search_key', value: res[1] },
                { name: 'search_value', value: res[0] },
            ]);
        });
        this.setTableWidth();
    }

    ionViewWillEnter() {}

    setTableWidth() {
        this.tableWidth = 270;
        this.tableTenWidth = 150;
        this.tableSevenWidth = 150;
        this.tableThreeWidth = 0;
        this.tableTwoWidth = 0;
        this.tenColSpan = 1;
        this.sevenColSpan = 1;
        this.threeColSpan = 0;
        this.twoColSpan = 0;
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
                name: '工厂名称',
                width: 160,
                permission: 'factory-name',
            },
            {
                name: '计划验货时间',
                width: 160,
                permission: 'inspection-time',
            },
            {
                name: '跟单人',
                width: 100,
                permission: 'schedule-name',
            },
            {
                name: '申请人',
                width: 90,
                permission: 'purchaser',
            },
            {
                name: '状态',
                width: 100,
                permission: 'inspection-status',
            },
            {
                name: '验货SKU数',
                width: 100,
                permission: 'inspect-sku-num',
            },
            {
                name: '合同号',
                width: 150,
                permission: 'contract-no',
            },
            {
                name: '预计装柜时间',
                width: 100,
                permission: 'estimated-loading-time',
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
            this.userLimit.has(td.permission, 43) && (this.tableWidth += td.width);
            !this.userLimit.has(td.permission, 43) && console.log(td);
            if (
                td.name === '最早可验货时间' ||
                td.name === '工厂名称' ||
                td.name === '计划验货时间' ||
                td.name === '跟单人' ||
                td.name === '采购人' ||
                td.name === '状态' ||
                td.name === '验货SKU数' ||
                td.name === '合同号' ||
                td.name === '预计装柜时间'
            ) {
                this.tenColSpan++;
                this.userLimit.has(td.permission, 43) && (this.tableTenWidth += td.width);
                if (
                    td.name === '跟单人' ||
                    td.name === '采购人' ||
                    td.name === '状态' ||
                    td.name === '验货SKU数' ||
                    td.name === '合同号' ||
                    td.name === '预计装柜时间'
                ) {
                    this.sevenColSpan++;
                    this.userLimit.has(td.permission, 43) && (this.tableSevenWidth += td.width);
                }
            }

            if (td.name === '备注' || td.name === '货号' || td.name === '货号备注') {
                this.threeColSpan++;
                this.userLimit.has(td.permission, 43) && (this.tableThreeWidth += td.width);
                if (td.name === '货号' || td.name === '货号备注') {
                    this.twoColSpan++;
                    this.userLimit.has(td.permission, 43) && (this.tableTwoWidth += td.width);
                }
            }
        });

        console.log(
            this.twoColSpan,
            this.threeColSpan,
            this.sevenColSpan,
            this.tenColSpan,
            this.tableWidth,
            this.tableTenWidth,
            this.tableSevenWidth,
            this.tableThreeWidth,
            this.tableTwoWidth,
        );
    }

    getConfirmedTask(e?: Array<{ name: string; value: string }> | any) {
        if (e && e.length) e.forEach(item => (this.getConfirmedParams[item.name] = item.value));
        else e && (this.getConfirmedParams[e.name] = e.value ? e.value : '');
        this.inspectService.getConfirmedTask(e && this.getConfirmedParams).subscribe((data: any) => {
            this.confirmedGroup = data.data;
            this.contracts = data;
            this.confirmedGroup.forEach(group => {
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
        this.getConfirmedParams.page = e.pageNum;
        this.getConfirmedTask({
            name: 'page',
            value: e.pageNum,
        });
    }

    setAllTipsHide(e: any) {
        if (e.target.className.indexOf('chip-text-tips') == -1) {
            this.confirmedGroup.forEach(data => {
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

    seeSku(p: sku, firstLevel: number, secondLevel: number, thirdLevel: number) {
        let option: ModalOptions = {
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            componentProps: { contract: p, showType: 'list', applyInspectId: p.id, showBtnGroup: { revoke: true } },
        };

        this.effectCtrl.showModal(option, data => {
            console.log(this.confirmedGroup[firstLevel]['apply_inspections'][secondLevel]['data']);
            if (!!data) {
                this.getConfirmedTask();
                //this.confirmedGroup[firstLevel]['apply_inspections'][secondLevel]['data'].splice(thirdLevel,1)
                //this.confirmedGroup = [...this.confirmedGroup];
            }
        });
    }

    editTask() {
        let option: ModalOptions = {
            component: EditTaskComponent,
            cssClass: 'modal_a',
        };

        this.effectCtrl.showModal(option, (data: any) => {
            data && this.getConfirmedTask();
        });
    }

    seeDetail(p: any) {
        let option: ModalOptions = {
            component: ConfirmedPopupBoxComponent,
            componentProps: { contract: p },
            cssClass: 'see-confirmed',
        };
        this.effectCtrl.showModal(option);
    }

    cancelExamineInspection(p: any) {
        this.effectCtrl.showAlert({
            header: '提示',
            message: `确定要返回上一步吗？`,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.inspectService.cancelExamineInspection(p.id).subscribe(data => {
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: data.message,
                            });
                            if (data.status == 1) {
                                this.getConfirmedTask();
                            }
                        });
                    },
                },
            ],
        });
    }

    GetMonday(dd) {
        if (!dd) return null;
        var week = dd.getDay(); //获取时间的星期数
        var minus = week ? week - 1 : 6;
        dd.setDate(dd.getDate() - minus); //获取minus天前的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取月份
        var d = dd.getDate();
        return y + '-' + m + '-' + d;
    }

    weekStart: string = '';

    getWeek(e: any) {
        this.generateTaskGroupName = this.GetMonday(e);
        //选择时间后将 显示所有 删除
        delete this.getConfirmedParams.select_all;
        if (this.grouping) return;
        this.weekStart = this.GetMonday(e);

        if (this.weekStart) {
            this.getConfirmedTask({
                name: 'group_name',
                value: this.weekStart,
            });
        } else {
            this.getConfirmedParams.group_name = '';
            this.getConfirmedTask();
        }
    }

    getFirstDayOfWeek(date) {
        var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
        date.setDate(date.getDate() - weekday - 1); //往前算（weekday-1）天，年份、月份会自动变化
        return date;
    }

    getLastDayOfWeek(date) {
        if (!date) return null;
        var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
        date.setDate(date.getDate() + weekday + 1); //往前算（weekday-1）天，年份、月份会自动变化
        return date;
    }

    exitGroup(p: any) {
        const { group_name, id } = p;
        this.effectCtrl.showAlert({
            header: '提示',
            message: `确定要退出组吗？`,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.inspectService.delGroupForTask({ group_name, id }).subscribe(data => {
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: data.message,
                            });
                            if (data.status == 1) {
                                this.getConfirmedTask({
                                    name: 'group_name',
                                    value: this.weekStart,
                                });
                            }
                        });
                    },
                },
            ],
        });
    }
}
