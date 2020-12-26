import { NzMessageService } from 'ng-zorro-antd';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { ArrayingService, Paging, ArrayingItem } from '../../services/arraying.service';
import { GlobalRedoService } from '../../services/global-redo.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

export interface InstallData {
    id: number;    //组的id
    truely_loading_time: string; // 实际装柜时间
    on_board_date: string; // 开船日期
    seal_no: string; // 铅封号
    container_no: string; // 柜号
    estimated_arrival_time: string; //预计到港时间
    sku_data: Array<{ id: number; truly_arraying_container_num: number;contract_title: string }>;
}
@Component({
    selector: 'app-installed-cabinets',
    templateUrl: './installed-cabinets.component.html',
    styleUrls: ['./installed-cabinets.component.scss'],
})
export class InstalledCabinetsComponent implements OnInit {
    data: Array<ArrayingItem> = [];
    pagingData: Paging<Array<ArrayingItem>> = {
        current_page: null,
        data: null,
        first_page_url: '',
        from: null,
        last_page: null,
        last_page_url: '',
        next_page_url: '',
        path: '',
        per_page: null,
        prev_page_url: '',
        to: null,
        total: null,
    };
    getListParams: any = {
        page: 1,
    };
    installData: InstallData = {
        id: null,
        truely_loading_time: '',
        on_board_date: '',
        seal_no: '',
        container_no: '',
        estimated_arrival_time: '',
        sku_data: [],
    };
    allChecked: boolean = false;
    swiperConfig: any = null;
    isVisible: boolean = false;
    current: any = {};
    modalFooter: any[] = [
        {
            label: '确定',
            size: 'small',
            disabled: () => {
                return !this.installData.container_no || 
                       !this.installData.estimated_arrival_time || 
                       !this.installData.on_board_date || 
                       !this.installData.seal_no  
                    //    !this.current.arraying_container_sku.every(sku => sku.truly_arraying_container_num && sku.contract_title)
            },
            onClick: () => {
                this.isVisible = false;
                this.submit();
            },
        },
        {
            label: '关闭',
            size: 'small',
            onClick: () => {
                this.isVisible = false;
            },
        },
    ];
    constructor(
        public arraying: ArrayingService,
        private globalRedo: GlobalRedoService,
        private baseData: BaseDataService,
        private msg: NzMessageService
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2017) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getLoadingData();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }

    getListByPaging(e: any) {}

    billOfL(p: any) {
        this.isVisible = true;
        this.current = p;
    }

    getLoadingData() {
        this.arraying.getLoadingData().subscribe(res => {
            this.pagingData = res;
            this.data = res.data;
        });
    }

    disabledDateLoading = (current: Date) => {
        return differenceInCalendarDays(current, new Date()) < 0;
    };

    disabledDateBoard = (current: Date) => {
        return differenceInCalendarDays(current,this.installData.truely_loading_time as any) < 0
        //  || differenceInCalendarDays(current,new Date()) < 0 
    }

    disabledDateArrival = (current: Date) => {
        return differenceInCalendarDays(current,this.installData.on_board_date as any) < 0 
        // || differenceInCalendarDays(current,new Date()) < 0 
    }

    installCabinet(p: ArrayingItem) {
        this.current = p;
        this.isVisible = true;
    }


    regValid(e: any) {
        if (!/^(?!0+(?:\0+)?$)(?:[1-9]\d*|0)(?:\\d{1,2})?$/.test(e.target.value)) {
            e.target.value = null;
        }
    }

    submit(){
        this.installData.id = this.current.id;
        this.current.arraying_container_sku.forEach(sku => {
            this.installData.sku_data.push({
                id: sku.id,
                truly_arraying_container_num: sku.truly_arraying_container_num,
                contract_title:sku.contract_title
            })
        });
        this.arraying.postLoadingData(this.installData)
            .subscribe(res => {
                this.msg[res.status?'success':'error'](res.message);
                res.status && this.getLoadingData();
                if(res.status) {
                    this.installData = {
                        id: null,
                        truely_loading_time: '',
                        on_board_date: '',
                        seal_no: '',
                        container_no: '',
                        estimated_arrival_time: '',
                        sku_data: []
                    };
                }
            })
    }

    cancelArrayedData(p: any, e: any) {
        this.arraying
            .cancelInstalledData({
                name: p.name, //批次号(组名)
            }) 
            .subscribe(res => {
                if(res.status){
                    this.getLoadingData();
                }
            });
    }

    get selectedIds() {
        if(!this.data) return   
        let arr = this.data.filter(res => (res as any).checked);
        let some = [];
        arr.map(res => some.push(res.id));
        return some;
    }

    selectChange(e: any, p: any) {
        (p as any).checked = e.detail.checked;
        // !e.detail.checked && (this.allChecked = false);
    }

    allCheck(e: any){
        this.data.forEach(res => (res as any).checked = e.detail.checked);
    }

    ionViewDidEnter(){
        this.getLoadingData();
    }
}
