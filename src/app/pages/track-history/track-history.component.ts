import { GlobalRedoService } from './../../services/global-redo.service';
import { BaseDataService } from '../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
    selector: 'app-track-history',
    templateUrl: './track-history.component.html',
    styleUrls: ['./track-history.component.scss'],
})
export class TrackHistoryComponent implements OnInit {
    config: SwiperConfigInterface = {};
    public historyList: trackHistory[];
    drawerVisible: boolean;
    currentHistory: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private Router: Router,
        private globalRedo: GlobalRedoService,
        public baseData: BaseDataService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 203) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.activeRoute.data.subscribe((data) => {
            this.historyList = data.data.data;
        });
    }

    ionViewWillEnter() {
        this.config = this.baseData.utilFn.getSwiperPublicConfig();
    }

    toDetail(p: any) {
        this.currentHistory = p;
        this.drawerVisible = true;
    }

    closeDrawer(): void {
        //关闭进度排除项框
        this.drawerVisible = false;
    }
}

export interface trackHistory {
    contract: any;
    contract_id: number;
    created_at: string;
    estimate_complete_time: string;
    id: number;
    schedule_id: number;
    status: any;
    updated_at: string;
    user_id: number;
    quantity: number;
    total_count: number;
    to_day: number;
    to_week: number;
    i?: number;
    week_Sunday?: string;
    week_Monday?: string;
    repeat_record?: number;
    username?: string;
}
