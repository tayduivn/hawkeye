import { PageEffectService } from '../../services/page-effect.service';
import { BaseDataService } from '../../services/base-data.service';
import { CreateInspecBatchPage } from '../../pages/create-inspec-batch/create-inspec-batch.page';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { InspectionService } from 'src/app/services/inspection.service';

@Component({
    selector: 'app-confirmed-inspect',
    templateUrl: './confirmed-inspect.component.html',
    styleUrls: ['./confirmed-inspect.component.scss'],
})
export class confirmedInspectComponent implements OnInit {
    swiperConfig: SwiperConfigInterface = {};
    @ViewChild('createInspecBatch', { static: false })
    createInspecBatch: CreateInspecBatchPage;
    currentHoverItem: any = { id: null };

    @Input() group: any;
    constructor(
        public baseData: BaseDataService,
        public effectCtrl: PageEffectService,
        private inspectService: InspectionService,
    ) {}

    ngOnInit() {
        this.group = [this.group];
        // this.createInspecBatch = CreateInspecBatchPage
    }

    ionViewWillEnter() {
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }

    enterReceiving() {
        this.inspectService.confirmationOfReceipt({ inspection_group_id: this.group[0].id }).subscribe((data) => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                this.effectCtrl.modalCtrl.dismiss({
                    refresh: true,
                });
            }
        });
    }
}
