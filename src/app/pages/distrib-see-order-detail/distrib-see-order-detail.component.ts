import { GlobalRedoService } from './../../services/global-redo.service';
import { InspectionService } from '../../services/inspection.service';
import { BaseDataService } from '../../services/base-data.service';
import { PageEffectService } from '../../services/page-effect.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper/dist';

@Component({
    selector: 'app-distrib-see-order-detail',
    templateUrl: './distrib-see-order-detail.component.html',
    styleUrls: ['./distrib-see-order-detail.component.scss'],
})
export class DistribSeeOrderDetailComponent implements OnInit {
    @Input() group: any = [];
    @Input() type?: string;
    swiperConfig: SwiperConfigInterface = {};
    constructor(
        private effectCtrl: PageEffectService,
        private baseData: BaseDataService,
        private inspectService: InspectionService,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (location.href.indexOf(res.path) != -1 || location.href.indexOf(res.parent) != -1) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.baseData.printDebug && console.log(this.group);
    }

    cancel() {
        this.effectCtrl.modalCtrl.dismiss();
    }

    ionViewWillEnter() {
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }

    revokeTask(p: any, type: 'group' | 'contract') {
        this.effectCtrl.showAlert({
            header: '提示',
            message: '确定要撤销此合同吗？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.inspectService.cancelInspectionGroup(p.contract_id, type).subscribe((data) => {
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: data.message,
                            });
                            if (data.status == 1) {
                                this.group.forEach((element, index) => {
                                    if (element.id == p.id) {
                                        this.group.splice(index, 1);
                                    }
                                });
                            }
                        });
                    },
                },
            ],
        });
    }
}
