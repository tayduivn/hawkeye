import { GlobalRedoService } from './../../services/global-redo.service';
import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { setInspecGroupParams, InspectionService } from 'src/app/services/inspection.service';
import { BaseDataService } from 'src/app/services/base-data.service';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ModalOptions } from '@ionic/core';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-order-grouping',
    templateUrl: './order-grouping.page.html',
    styleUrls: ['./order-grouping.page.scss'],
    providers: [DatePipe],
})
export class OrderGroupingPage implements OnInit {
    inspecList: Array<any> = [];
    swiperConfig: SwiperConfigInterface = {};
    public getListParams: any = {
        type: 'contract_no',
        keywords: '',
        order_by: '',
    };
    updateGroup: setInspecGroupParams = {
        inspection_group_name: '',
        contents: [],
        inspection_group_no: '',
    };
    inspection_group_no: string;
    private gridApi: any;
    private gridColumnApi: any;
    dragParamArray: Array<any> = [];
    defaultColDef = { colWidth: 100 };

    gridOpts: GridOptions = {
        pagination: true,
        paginationAutoPageSize: true,
        paginationStartPage: 1,
    };
    constructor(
        public baseData: BaseDataService,
        public userLimit: UserLimitService,
        private Router: Router,
        private effectCtrl: PageEffectService,
        private datePipe: DatePipe,
        private inspectService: InspectionService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 206) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getInspecList();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }
   

    getInspecList(e?: any) {
        e && (this.getListParams.order_by = e.value);
        this.inspectService.getArrangeInspecList(this.getListParams).subscribe(data => {
            this.inspecList = data.data;
            this.inspecList.forEach((data: any) => {
                data.created_at = this.datePipe.transform(data.created_at, 'yyyy-MM-dd');
                data.inspection_date = this.datePipe.transform(data.inspection_date, 'yyyy-MM-dd');
                data.address = data.ProviceName + data.CityName;
                data.is_new_factory = data.is_new_factory && data.is_new_factory == 1 ? '是' : '否';
                data.estimated_loading_time = this.datePipe.transform(data.estimated_loading_time, 'yyyy-MM-dd');
            });
            this.baseData.printDebug && console.log(data);
            this.Router.navigate(['dashboard/order-grouping']);
        });
    }

    seeSku(p: any) {
        let option: ModalOptions = {
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            componentProps: { contract: p, showType: 'list' },
        };
        this.effectCtrl.showModal(option);
    }

    canGetInspecNo: boolean = true;

    onKey() {
        if (this.canGetInspecNo) {
            this.canGetInspecNo = false;
            this.inspectService.generateInspecNo().subscribe(data => {
                this.inspection_group_no = data.inspection_group_no;
            });
        }
    }

    setGroupSubmit() {
        this.updateGroup.inspection_group_no = this.inspection_group_no;
        this.inspectService.setInspecGroup(this.updateGroup).subscribe((data: any) => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            this.updateGroup.inspection_group_name = '';
            setTimeout(() => {
                this.getInspecList();
                this.inspection_group_no = null;
                this.canGetInspecNo = true;
                this.updateGroup.contents = [];
            }, 1000);
        });
    }

    setContent() {
        this.updateGroup.contents = [];
        this.inspecList.forEach(item => {
            item.is_choice && this.updateGroup.contents.push(item.id);
        });
    }

    columnDefs = [
        {
            headerName: '合同号',
            rowDrag: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            resizable: true,
            checkbox: true,
            field: 'contract_no',
            width: 150,
            hide: !this.userLimit.has('contract-no', 32),
        },
        {
            headerName: '工厂名称',
            field: 'factory_name',
            resizable: true,
            width: 250,
            hide: !this.userLimit.has('factory-name', 32),
        },
        {
            headerName: '工厂地址',
            field: 'address',
            resizable: true,
            width: 120,
            unSortIcon: true,
            sortable: true,
            hide: !this.userLimit.has('factory-address', 32),
        },
        {
            headerName: '合同SKU数',
            field: 'total_quantity',
            resizable: true,
            width: 120,
            hide: !this.userLimit.has('contract-sku-quantity', 32),
        },
        {
            headerName: '验货SKU数',
            field: 'quantity',
            resizable: true,
            width: 120,
            hide: !this.userLimit.has('inspection-sku-quantity', 32),
        },
        {
            headerName: '新品SKU数量',
            field: 'new_quantity',
            resizable: true,
            width: 130,
            hide: !this.userLimit.has('new-sku-quantity', 32),
        },
        {
            field: 'is_new_factory',
            headerName: '是否是新工厂',
            resizable: true,
            width: 100,
            hide: !this.userLimit.has('is-new-factory', 32),
        },
        {
            headerName: '申请时间',
            field: 'created_at',
            resizable: true,
            width: 120,
            hide: !this.userLimit.has('created-at', 32),
        },
        {
            headerName: '最早可验货时间',
            field: 'inspection_date',
            resizable: true,
            width: 130,
            hide: !this.userLimit.has('earliest-inspection-time', 32),
        },
        {
            field: 'estimated_loading_time',
            headerName: '预计装柜时间',
            resizable: true,
            width: 130,
            hide: !this.userLimit.has('estimated-loading-time', 32),
        },
    ];

    rowDragEnd(e: any) {
        this.dragParamArray = [];
        this.baseData.printDebug && console.table(this.inspecList);
        console.log(e);
        this.inspecList = this.insertArrItem(this.inspecList, e.node, e.overIndex);
        this.inspecList.forEach((value, i) => {
            this.dragParamArray.push({
                id: value.id,
                sort: i + 1,
            });
        });
        this.inspectService.dragSortOfList({ sort_arr: this.dragParamArray }).subscribe(data => {});
        this.baseData.printDebug && console.table(this.inspecList);
    }

    //数组插入  轮子
    insertArrItem(arr, node, tindex) {
        let some = arr,
            index = null;
        if (tindex == -1) {
            tindex = arr.length - 1;
        }
        arr.forEach((element, i) => {
            if (node.data.id == element.id) {
                index = i;
            }
        });
        if (index > tindex) {
            some.splice(tindex, 0, some[index]);
            some.splice(index + 1, 1);
        } else {
            some.splice(tindex + 1, 0, some[index]);
            some.splice(index, 1);
        }
        return some;
    }

    onSelectionChanged(e: any) {
        var selectedRows = e.api.getSelectedRows();
        this.updateGroup.contents = [];
        selectedRows.forEach(item => {
            this.updateGroup.contents.push(item.id);
        });
    }

    onGridReady(e: any) {
        this.gridApi = e.api;
        this.gridColumnApi = e.columnApi;
    }

    cellClicked(e: any) {
        console.log(e);
    }

    rowClicked(e: any) {
        console.log(e);
        let currentContract = e.data,
            option: ModalOptions = {
                component: CustomPopupComponent,
                cssClass: 'modal_a',
                componentProps: { contract: currentContract, showType: 'list' },
            };
        this.effectCtrl.showModal(option);
    }

    getListBySearch() {
        if (this.getListParams.type == '') {
            this.effectCtrl.clearEffectCtrl();
            this.msg.error('请选择搜索类型');

            return;
        }
        this.getInspecList();
    }

    segmentChange() {
        if (this.getListParams.keywords) {
            this.getInspecList();
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
