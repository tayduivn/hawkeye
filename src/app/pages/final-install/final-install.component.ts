import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { Paging, ArrayingItem, ArrayingService } from 'src/app/services/arraying.service';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-final-install',
    templateUrl: './final-install.component.html',
    styleUrls: ['./final-install.component.scss'],
})
export class FinalInstallComponent implements OnInit {
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
    keywords: FormControl = new FormControl('');
    data: ArrayingItem[] = [];
    getListParams: any = {
        page: 1,
        search_key: 'factory_name',
        search_value: '',
    };
    allChecked: boolean = false;
    swiperConfig: any = {};
    constructor(
        private arraying: ArrayingService,
        private globalRedo: GlobalRedoService,
        private baseData: BaseDataService,
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2018) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.keywords.valueChanges.pipe(debounceTime(1500)).subscribe(res => {
            console.log(res);
            this.getListParams.search_value = res;
            this.getList();
        });
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
        this.getList();
    }

    getList(e?: any) {
        e && (this.getListParams.page = e);
        this.arraying.getFinalData(this.getListParams).subscribe(res => {
            this.msg[res.status ? 'success' : 'error'](res.message);
            if (res.status) this.pagingData = res.data;
        });
    }

    getListByPaging(e: any) {
        this.getListParams.page = e.pageNum;
        this.getList(this.getListParams.page);
    }

    cancelArrayedData(p: any, e: any) {
        this.arraying
            .cancelFinalCabinet({
                name: p.name, //批次号(组名)
            })
            .subscribe(res => {
                if (res.status) {
                    this.getList();
                }
            });
    }

    get selectedIds() {
        if (!this.pagingData.data) return;
        let arr = this.pagingData.data.filter(res => (res as any).checked);
        let some = [];
        arr.map(res => some.push(res.id));
        return some;
    }

    selectChange(e: any, p: any) {
        (p as any).checked = e.detail.checked;
        // !e.detail.checked && (this.allChecked = false);
    }

    allCheck(e: any) {
        this.pagingData.data.forEach(res => ((res as any).checked = e.detail.checked));
    }


    ionViewDidEnter(){
        this.getList();
    }
}
