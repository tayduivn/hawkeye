import { GlobalRedoService } from './../../../services/global-redo.service';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { ModalOptions } from '@ionic/core';
import { BaseDataService } from 'src/app/services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { InspectSettingBoxComponent } from 'src/app/component/inspect-setting-box/inspect-setting-box.component';

@Component({
    selector: 'app-insepc-contract',
    templateUrl: './insepc-contract.component.html',
    styleUrls: ['./insepc-contract.component.scss'],
})
export class InsepcContractComponent implements OnInit {
    contract: any = {
        contract_no: '',
        quantity: '',
    };
    constructor(
        public baseData: BaseDataService,
        private globalRedo: GlobalRedoService,
        private effectCtrl: PageEffectService,
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.contract = JSON.parse(sessionStorage.getItem('CURRENT-INSEPC-CONTRACT'));
        console.log(this.contract);
    }

    ionViewWillLeave() {
        sessionStorage.removeItem('CURRENT-INSEPC-CONTRACT');
    }

    inspecSetting(p: any) {
        let option: ModalOptions = {
            component: InspectSettingBoxComponent,
            cssClass: 'inspec-setting',
            componentProps: { contract: p },
        };
        this.effectCtrl.showModal(option, (data: any) => {
            this.contract = data;
            console.log(data);
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
}
 