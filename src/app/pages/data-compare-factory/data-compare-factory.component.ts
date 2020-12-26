import { GlobalRedoService } from './../../services/global-redo.service';
import { ActivatedRoute } from '@angular/router';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { DataCompareService } from 'src/app/services/data-compare.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-data-compare-factory',
    templateUrl: './data-compare-factory.component.html',
    styleUrls: ['./data-compare-factory.component.scss'],
})
export class DataCompareFactoryComponent implements OnInit {
    imgOrigin: string = environment.usFileUrl;
    data: any = {
        factory: null,
        contract: [],
        factoryObj: {
            new_address: {},
            new_contact_name: {},
            factory_people_num: {},
            factory_equipment_name: {},
        },
    };
    apply_inspection_no: string = '';
    constructor(
        private dataCompare: DataCompareService,
        private activeRouted: ActivatedRoute,
        public baseData: BaseDataService,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 2013) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.activeRouted.params.subscribe((res) => {
            this.apply_inspection_no = res.ano;
        });
        this.dataCompare
            .getCompareFactoryAndContractData({ apply_inspection_no: this.apply_inspection_no })
            .subscribe((res) => {
                this.data = res.data;
                this.data.factoryObj = {};
                this.data.factory.forEach((res) => {
                    this.data.factoryObj[res.name] = res;
                });
            });
    }
}
