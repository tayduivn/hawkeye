import { GlobalRedoService } from './../../services/global-redo.service';
import { environment } from './../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DataCompareService } from './../../services/data-compare.service';
import { BaseDataService } from 'src/app/services/base-data.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

export interface CompareItem {
    name: string;
    chinese_name: string;
    type: 'pic' | 'video' | 'desc';
    system: any;
    posted: any;
    compare_res?: boolean;
    box_type?: 'inner' | 'outer' | 'test';
}
@Component({
    selector: 'app-data-compare-detail',
    templateUrl: './data-compare-detail.component.html',
    styleUrls: ['./data-compare-detail.component.scss'],
})
export class DataCompareDetailComponent implements OnInit {
    @ViewChild('player', { static: false }) player: ElementRef;
    imgOrigin: string = environment.usFileUrl;
    apply_inspection_no: string = '';
    contract_id: number = null;
    sku: any = '';
    data: any;
    compareData: CompareItem[] = [];
    drawer: boolean = false;
    currentCompareHistoryData: any[] = [];
    historyField: string = '';
    modalShow: boolean = false;
    modalVideos: string[] = [];
    currentVideo: string = '';
    modalFooter: any[] = [
        {
            label: '关闭',
            size: 'small',
            onClick: () => {
                this.modalShow = false;
                this.modalVideos = [];
                this.currentVideo = '';
            },
        },
    ];
    constructor(
        public baseData: BaseDataService,
        private dataCompare: DataCompareService,
        private activeRouter: ActivatedRoute,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            if (!res) return;
            if (res.uid == 2012) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.activeRouter.data.subscribe((data: any) => {
            this.compareData = data.data ? data.data : null;
        });

        this.activeRouter.params.subscribe((res) => {
            this.apply_inspection_no = res.applyId;
            this.sku = res.sku;
        });
    }

    showHistory(p: any) {
        this.drawer = !this.drawer;
        this.historyField = p.chinese_name;
        this.dataCompare
            .getCompareForHistory({ apply_inspection_no: this.apply_inspection_no, sku: this.sku, type: p.name })
            .subscribe((res) => {
                this.currentCompareHistoryData = res.data;
            });
    }

    play() {
        this.player.nativeElement.play();
    }

    ngAfterViewInit(): void {}
}
