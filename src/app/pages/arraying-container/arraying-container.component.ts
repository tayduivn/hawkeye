import { Component, OnInit } from '@angular/core';
import { ArrayingService, Paging, ArrayingContainerData } from 'src/app/services/arraying.service';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { BaseDataService } from '../../services/base-data.service';
import { ArrayingItem } from '../../services/arraying.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
    selector: 'app-arraying-container',
    templateUrl: './arraying-container.component.html',
    styleUrls: ['./arraying-container.component.scss'],
})
export class ArrayingContainerComponent implements OnInit {
    list: Observable<ArrayingItem[]>;
    isVisible: boolean = false;
    current: any = {};
    shipping_room: Observable<Array<{ id: number; name: string; name_chinese: string }>>;
    data: ArrayingContainerData = {
        id: null,
        bl_no: '',
        estimate_loading_time: '',
        shipping_room: '',
        desc: '',
        charges: [],
    };
    paging: Paging<any[]> = {
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
    swiperConfig: any = null;
    metaList: ArrayingItem[];
    allChecked: boolean = false;
    constructor(
        public arraying: ArrayingService,
        private globalRedo: GlobalRedoService,
        private es: PageEffectService,
        private baseData: BaseDataService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2016) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.init();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }

    modalFooter: any[] = [
        {
            label: '确定',
            size: 'small',
            disabled: () => {
                return !this.data.estimate_loading_time || !this.data.shipping_room || !this.data.bl_no;
            },
            onClick: () => {
                this.isVisible = false;
                this.data.id = this.current.id;
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

    init() {
        this.list = this.arraying.getAlreadyContainerData().pipe(
            tap(res => {
                this.paging = res.data;
            }),
            map(res => res.data.data),
        );
        this.shipping_room = this.arraying.getAlreadyContainerData().pipe(map(res => res.shipping_rooms));
        this.list.subscribe(res => {
            this.metaList = res;
        });
    }

    billOfL(p: any) {
        this.isVisible = true;
        this.current = p;
    }

    getListByPaging(e: any) {
        this.getListParams.page = e.pageNum;
        this.list = this.arraying.getAlreadyContainerData(this.getListParams.page).pipe(
            tap(res => {
                this.paging = res.data;
            }),
            map(res => res.data.data),
        );
    }

    disabledDate = (current: Date) => {
        return differenceInCalendarDays(current, new Date()) < 0;
    };

    submit() {
        this.current.factory_info.map(res => {
            this.data.charges.push({
                factory_code: res.factory_code,
                factory_name: res.factory_name,
                charge: res.charges,
                desc: res.charges_desc,
            });
        });

        this.arraying.postArrayingContainerData(this.data).subscribe(res => {
            this.data = {
                id: null,
                bl_no: '',
                estimate_loading_time: '',
                shipping_room: '',
                desc: '',
                charges: [],
            };
            this.init();
            this.es.showAlert({
                message: res.message,
            });
        });
    }

    cancelArrayedData(p: any, e: any) {
        this.arraying
            .cancelArrayedData({
                arraying_container_sku_id: e.id, //  批次里面的具体每个sku的所在数据的id
                name: p.name, //批次号(组名)
            })
            .subscribe(res => {
                if (res.status) {
                    this.init();
                }
            });
    }

    get selectedIds() {
        if (!this.metaList) return;
        let arr = this.metaList.filter(res => (res as any).checked);
        let some = [];
        arr.map(res => some.push(res.id));
        return some;
    }

    selectChange(e: any, p: any) {
        (p as any).checked = e.detail.checked;
        // !e.detail.checked && (this.allChecked = false);
    }

    allCheck(e: any) {
        this.metaList.forEach(res => ((res as any).checked = e.detail.checked));
    }

    log() {
        console.log(this.selectedIds);
    }


    ionViewDidEnter(){
        this.init();
    }
}
