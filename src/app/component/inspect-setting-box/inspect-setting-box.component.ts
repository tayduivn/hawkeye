import { PageEffectService } from './../../services/page-effect.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { InspectionService } from 'src/app/services/inspection.service';

@Component({
    selector: 'app-inspect-setting-box',
    templateUrl: './inspect-setting-box.component.html',
    styleUrls: ['./inspect-setting-box.component.scss'],
})
export class InspectSettingBoxComponent implements OnInit {
    @Input() set contract(input: any) {
        this._contract = JSON.parse(JSON.stringify(input));
    }

    _contract: any;
    constructor(
        private modalService: ModalController,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
    ) {}

    ngOnInit() {}

    enter() {
        let params = {
            is_contacted_factory: this._contract.is_c_ontackedfactory ? 1 : 0,
            is_bought_ticket: this._contract.is_bought_ticket ? 1 : 0,
            is_inspected_factory: this._contract.is_inspected_factory ? 1 : 0,
            is_inspected_product: this._contract.is_inspected_product ? 1 : 0,
            is_plan_date: this._contract.is_plan_date ? 1 : 0,
            is_know_demand: this._contract.is_know_demand ? 1 : 0,
            apply_id: this._contract.id,
        };
        this.inspectService.inspecerSetting(params).subscribe((data) => {
            if (data.status == 1) {
                this.modalService.dismiss({
                    refresh: this.contract,
                });
            } else this.modalService.dismiss();

            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
        });
    }
}
