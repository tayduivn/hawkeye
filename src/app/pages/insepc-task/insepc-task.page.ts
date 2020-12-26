import { GlobalRedoService } from './../../services/global-redo.service';
import { SkuDescPopupComponent } from './../../component/sku-desc-popup/sku-desc-popup.component';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { ModalOptions } from '@ionic/core';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { InspectionService } from 'src/app/services/inspection.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Router } from '@angular/router';
import { InspectSettingBoxComponent } from 'src/app/component/inspect-setting-box/inspect-setting-box.component';

@Component({
    selector: 'app-insepc-task',
    templateUrl: './insepc-task.page.html',
    styleUrls: ['./insepc-task.page.scss'],
})
export class InsepcTaskPage implements OnInit {
    swiperConfig: SwiperConfigInterface = {};
    stateModal: boolean = false;
    inspecList: any[] = [];
    constructor(
        public baseData: BaseDataService,
        private router: Router,
        private effectCtrl: PageEffectService,
        private inspectService: InspectionService,
        private globalRedo: GlobalRedoService,
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.getInspecionTask();
    }

    getInspecionTask() {
        this.inspectService.getInspecionTask().subscribe((data) => {
            this.inspecList = data;
            this.baseData.printDebug && console.log(data);
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

    inspecSetting(p: any) {
        console.log(p); 
        let option: ModalOptions = {
            component: InspectSettingBoxComponent,
            cssClass: 'inspec-setting',
            componentProps: { contract: p },
        };
        this.effectCtrl.showModal(option, (data: any) => {
            console.log(data);
        });
    }

    goInsepcContract(p: any) {
        sessionStorage.setItem('CURRENT-INSEPC-CONTRACT', JSON.stringify(p));
        this.router.navigate(['insepc-contract']);
    }

    skuDesc(p: any) {
        let option: ModalOptions = {
            component: SkuDescPopupComponent,
            cssClass: 'modal_a',
            componentProps: { skuDesc: p.sku_desc },
        };

        this.effectCtrl.showModal(option);
    }
}
