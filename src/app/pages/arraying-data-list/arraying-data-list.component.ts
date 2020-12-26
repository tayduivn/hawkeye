import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { ArrayingService, Paging, ParamForArrayTotal } from '../../services/arraying.service';
import { sku } from '../task-add/task-add.page';
import { map, tap } from 'rxjs/operators';
import { GlobalRedoService } from '../../services/global-redo.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-arraying-data-list',
    templateUrl: './arraying-data-list.component.html',
    styleUrls: ['./arraying-data-list.component.scss'],
})
export class ArrayingDataListComponent implements OnInit {
    arrayingList: sku[] = [];
    isVisible: boolean = false;
    isAllDisplayDataChecked: boolean = false;
    mapOfCheckedId: { [key: number]: boolean } = {};
    paging: Paging<sku[]> = {
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
    constructor(
        public arraying: ArrayingService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2015) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.init();
    }

    init() {
        this.arraying
            .getWaitingContainerData()
            .pipe(
                tap(res => {
                    this.paging = res;
                }),
                map(res => res.data),
            )
            .subscribe(res => {
                this.arrayingList = res;
                res.map(sku => {
                    this.mapOfCheckedId[sku.id] = false;
                });
            });
    }

    
    regValid(e: any) {
        if (!/^(?!0+(?:\0+)?$)(?:[1-9]\d*|0)(?:\\d{1,2})?$/.test(e.target.value)) {
            e.target.value = null;
        } 
    }

    onBlur(e: Event, data: any) {
        if ((e.target as any).value > data.able_container_num) {
            this.msg.error('不能大于最大排柜数量，请重新输入');
            (e.target as any).value = null;
        } else if ((e.target as any).value <= 0) {
            this.msg.error('无效值，请重新输入');
            (e.target as any).value = null;
        }
    }

    checkAll(e: any) {
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key)) {
                this.mapOfCheckedId[key] = this.isAllDisplayDataChecked;
            }
        }
    }

    refreshStatus(id: number) {}

    doArraying() {
        this.isVisible = true;
        const params: ParamForArrayTotal = {
            arraying_container_sku_arr: this.skuIds,
        };
        this.arraying.showArrayContainerTotal(params).subscribe(res => {
            this.total = res.data;
        });
    }

    // get canClick() :Observable<boolean>{
    //     const params: ParamForArrayTotal = {
    //         arraying_container_sku_arr: this.skuIds,
    //     };
    //     return this.arraying.showArrayContainerTotal(params)
    //     .pipe(map(res => res.data.arraying_container_num_total >= 0))
    // }
    
    total: {
        arraying_container_num_total?: 28;
        gross_weight_total?: 993;
        net_weight_total?: 776;
        product_num_total?: 28;
        size_volume_total?: 4944;
    } = {};

    get rowIsSelected() {
        let val = false;
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key)) {
                this.mapOfCheckedId[key] && (val = this.mapOfCheckedId[key]);
            }
        }
        return val;
    }

    handleOk() {
        if(this.total.arraying_container_num_total <= 0){
            this.msg.error('请重新输入排柜数量');
            return
        }
        this.arraying.postContainerData(this.skuIds).subscribe(res => {
            this.msg.info(res.message);
            if (res.status) {
                this.isVisible = false;
                setTimeout(() => {
                    this.init();
                }, 1500);
            }
        });
    }

    get selectedIds(): Array<number> {
        let val: Array<number> = [];
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key) && this.mapOfCheckedId[key]) {
                val.push(key as any);
            }
        }
        return val;
    }

    get skuIds(): Array<{ arraying_container_num: number; id: number }> {
        let ids: string[] = [];
        let val: Array<{ arraying_container_num: number; id: number }> = [];
        for (const key in this.mapOfCheckedId) {
            if (this.mapOfCheckedId.hasOwnProperty(key)) {
                this.mapOfCheckedId[key] && ids.push(key);
            }
        }
        this.arrayingList.forEach(res => {
            if (ids.indexOf(String(res.id)) != -1) {
                val.push({
                    arraying_container_num: (res as any).arraying_container_num,
                    id: res.id,
                });
            }
        });
        return val;
    }

    ionViewDidEnter() {
        this.init();
    }
}
