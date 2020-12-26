import { FormControl } from '@angular/forms';
import { Paging, ArrayingService, ParamForDataCompare } from './../../services/arraying.service';
import { sortObj } from './../../component/sort/sort.component';
import { GlobalRedoService } from './../../services/global-redo.service';
import { Router } from '@angular/router';
import { DataCompareService, GetBasicDataParam } from './../../services/data-compare.service';
import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BaseDataService } from '../../services/base-data.service';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { PageEffectService } from '../../services/page-effect.service';
import { ModalOptions } from '@ionic/core';
import { environment } from '../../../environments/environment';
import { debounceTime } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ExamineService } from 'src/app/services/examine.service';
import { NzMessageService } from 'ng-zorro-antd';
import { UserLimitService } from 'src/app/services/user-limit.service';

@Component({
    selector: 'app-data-compare',
    templateUrl: './data-compare.page.html',
    styleUrls: ['./data-compare.page.scss'],
})
export class DataComparePage implements OnInit {
    swiperConfig: SwiperConfigInterface = {};
    data: any = [];
    currentFactory: any = {
        data: [],
    };
    dateRange = [];
    maskIsVisible: boolean = false;
    keywords: FormControl = new FormControl('');
    cabinetShow: boolean = false;
    getListParams: GetBasicDataParam = {
        page: 1,
        is_passed: '',
        sort_key: '',
        sort_value: '',
        search_key: null,
        search_value: '',
        inspection_date_start: null,
        inspection_date_end: null,
    };
    currentSku: any;
    reviewStatus: Array<{ key: number; value: string }> = [];
    searchVal: FormControl = new FormControl(''); //'factory_name' | 'sku'
    funnels: Array<{ key: string; value: string }> = [
        {
            key: '默认',
            value: '',
        },
        {
            key: '验货通过',
            value: 'status1',
        },
        {
            key: '验货待定',
            value: 'status2',
        },
        {
            key: '验货不通过',
            value: 'status3',
        },
        // {
        //     key: '重新验货',
        //     value: 'status4',
        // },
    ];
    tableWidth: number = 0;
    tableFourWidth: number = 0;
    fourColSpan: number = 0;
    allChecked: boolean = false;
    constructor(
        public dataCompare: DataCompareService,
        private globalRedo: GlobalRedoService,
        private router: Router,
        private baseData: BaseDataService,
        private effectCtrl: PageEffectService,
        private examine: ExamineService,
        private msg: NzMessageService,
        public userLimit: UserLimitService,
        private arrayCtrl: ArrayingService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2014) {
                this.getListParams.page = 1;
                this.getList();
            }
        });

        let key = this.keywords.valueChanges.pipe(debounceTime(500));
        let sType = this.searchVal.valueChanges.pipe(debounceTime(500));

        combineLatest(key, sType).subscribe(res => {
            this.getListParams.page = 1;
            this.getList({ search_key: res[1], search_value: res[0] });
        });
    }

    ngOnInit() {
        this.getListParams.page = 1;
        this.getList();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
        this.setTableWidth();
    }

    total: Paging<any> = {
        current_page: null,
        data: null,
        first_page_url: null,
        from: null,
        last_page: null,
        last_page_url: null,
        next_page_url: null,
        path: null,
        per_page: null,
        prev_page_url: null,
        to: null,
        total: null,
    };

    setTableWidth() {
        this.tableWidth = 710;
        this.tableFourWidth = 0;
        this.fourColSpan = 0;
        let table: Array<{ name: string; width: number; permission: any }> = [
            {
                name: '流水号',
                width: 110,
                permission: 'apply-inspection-no',
            },
            {
                name: '工厂',
                width: 120,
                permission: 'factory-name',
            },
            {
                name: '合同号',
                width: 180,
                permission: 'contract-no',
            },
            {
                name: 'SKU',
                width: 150,
                permission: 'sku',
            },
            {
                name: 'SKU中文名',
                width: 200,
                permission: 'sku-chinese',
            },
            {
                name: '验货状态',
                width: 90,
                permission: 'inspection-status',
            },
            {
                name: '验货人',
                width: 100,
                permission: 'inspector',
            },
            {
                name: '验货时间',
                width: 120,
                permission: 'inspection-time',
            },
        ];

        table.forEach(td => {
            !this.userLimit.has(td.permission, 243) && console.log(td);
            this.userLimit.has(td.permission, 243) && (this.tableWidth += td.width);
            if (td.name === '合同号' || td.name === 'SKU' || td.name === 'SKU中文名' || td.name === '验货状态') {
                this.userLimit.has(td.permission, 243) && this.fourColSpan++;
                this.userLimit.has(td.permission, 243) && (this.tableFourWidth += td.width);
            }
        });

        console.log(this.tableWidth, this.tableFourWidth);
    }

    getList(params?: GetBasicDataParam) {
        this.dataCompare.getCompareBasicList(params).subscribe(res => {
            this.data = res.data.data.data;
            this.total = res.data.data;
            this.reviewStatus = res.data.review_status;
        });
    }

    currentSkuArr: any[] = [];

    currentFactoryContractArr: Array<[]>;
    currentResetContractForSku: string = '';
    showModal(p: any, s: any) {
        this.currentFactory = p;
        this.maskIsVisible = !this.maskIsVisible;
        this.dataCompare
            .getResetContractList({ apply_inspection_no: p.apply_inspection_no, sku: s.sku })
            .subscribe(res => {
                this.currentFactoryContractArr = res.data.contract_arr;
                console.log(this.currentFactoryContractArr);
                this.currentSku = res.data.sku;
            });
    }

    submitCabinet(e: any) {
        this.currentFactory = e;
        this.currentSkuArr = JSON.parse(
            JSON.stringify(this.currentFactory.data.filter((item: any) => item.is_passed === 1)),
        );
        console.log(e);
        this.cabinetShow = !this.cabinetShow;
    }

    doCabinet() {
        const meta = this.currentFactory.data[0];
        const params: Array<ParamForDataCompare> = [];
        let some: boolean = true;
        this.currentSkuArr.forEach(element => {
            if (
                !element.outer_box_size_width ||
                !element.outer_box_size_height ||
                !element.outer_box_size_length ||
                !element.bar_code ||
                !element.container_num ||
                !element.outer_gross_weight ||
                !element.factory_name ||
                !element.factory_address ||
                !element.factory_contacts ||
                !element.mobil_phone
            ) {
                some = false;
                return;
            }
            params.push({
                apply_inspection_no: this.currentFactory.apply_inspection_no,
                contract_no: element.contract_no_arr,
                sku: element.sku,
                outer_box_size_width: element.outer_box_size_width,
                outer_box_size_height: element.outer_box_size_height,
                outer_box_size_length: element.outer_box_size_length,
                bar_code: element.bar_code,
                container_num: element.container_num,
                outer_gross_weight: element.outer_gross_weight,
                outer_net_weight: element.outer_net_weight,
                factory_name: element.factory_name,
                factory_address: element.factory_address,
                factory_contacts: element.factory_contacts,
                mobil_phone: element.mobil_phone,
                schedule_user_name: element.schedule_user_name,
                purchaser_user_name: element.purchaser_user_name,
            });
        });
        if (!some) {
            this.msg.error('请填写完整数据');
            return;
        }
        console.table(params);
        this.arrayCtrl.postArrayDataForDataCompare({ data: params }).subscribe(res => {
            this.msg[res.status ? 'success' : 'error'](res.message);
            this.cabinetShow = !Boolean(res.status);
        });
    }

    getListByPaging(e: any) {
        this.getListParams.page = e.pageNum;
        this.getList(this.getListParams);
    }

    toDetail(d: any, sku: any) {
        this.currentSku = sku;
        this.router.navigate(['dashboard/data-compare-detail', d.apply_inspection_no, sku.sku, sku.contract_no_arr]);
    }

    reports(p: any) {
        window.open(
            environment.apiUrl + '/task/get_inspection_task_reports?apply_inspection_no=' + p.apply_inspection_no,
        );
    }

    preview(p: any) {
        window.open(
            environment.apiUrl + '/task/show_inspection_task_reports?apply_inspection_no=' + p.apply_inspection_no,
        );
    }

    downloadImage(p: any) {
        window.open(
            environment.apiUrl +
                '/task/get_inspection_task_reports_for_image?apply_inspection_no=' +
                p.apply_inspection_no,
        );
    }

    funnelSelected(e: any) {
        this.getListParams.is_passed = e.value;
        this.getList({ is_passed: this.getListParams.is_passed });
    }

    downloadVideo(p: any) {
        window.open(
            environment.apiUrl +
                '/task/get_inspection_task_reports_for_video?apply_inspection_no=' +
                p.apply_inspection_no,
        );
    }

    seeSku(p: any) {
        let option: ModalOptions = {
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            componentProps: { contract: p, showType: 'list' },
        };
        this.effectCtrl.showModal(option);
    }

    statusChange(e: any, p: any) {
        this.dataCompare
            .taskDataReview({
                apply_inspection_no: p.apply_inspection_no,
                review_status: e,
                contract_no: p.contract_no,
            })
            .subscribe(res => {});
    }

    getListBySort(e: sortObj) {
        this.getListParams.sort_key = e.name;
        this.getListParams.sort_value = e.value;
        this.getListParams.page = 1;
        this.getList(this.getListParams);
    }

    getListBySearch() {}

    onChange(result: Date[]): void {
        this.getListParams.inspection_date_start = result[0].toDateString();
        this.getListParams.inspection_date_end = result[1].toDateString();

        this.dataCompare.downExcel({
            id_arr: this.selectedIds,
            start: result[0].toDateString(),
            end: result[1].toDateString(),
        });
    }

    resetSku() {
        if (!this.currentResetContractForSku) {
            this.msg.error('暂无合同');
            this.maskIsVisible = !this.maskIsVisible;
            return;
        }
        const params: any = {
            apply_inspection_no: this.currentFactory.apply_inspection_no,
            contract_no: this.currentResetContractForSku,
            sku: this.currentSku,
        };
        this.examine.resetInspectTaskSku(params).subscribe(res => {
            this.msg[res && res.status ? 'success' : 'error'](res.message);
            this.maskIsVisible = !this.maskIsVisible;
            res.status && this.getList();
            this.currentResetContractForSku = null;
        });
    }

    get selectedIds() {
        if (!this.data) return;
        let arr = this.data.filter(res => (res as any).checked);
        let some = [];
        arr.map(res => some.push(res.apply_inspection_no));
        return some;
    }

    selectChange(e: any, p: any) {
        (p as any).checked = e.detail.checked;
        // !e.detail.checked && (this.allChecked = false);
    }

    allCheck(e: any) {
        this.data.forEach(res => ((res as any).checked = e.detail.checked));
    }

    log() {
        console.log(this.data);
    }
}
