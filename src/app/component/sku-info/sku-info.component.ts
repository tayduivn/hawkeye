import { Component, OnInit, Input } from '@angular/core';
import { contract } from 'src/app/pages/task-add/task-add.page';
import { BaseDataService } from 'src/app/services/base-data.service';

@Component({
    selector: 'app-sku-info',
    templateUrl: './sku-info.component.html',
    styleUrls: ['./sku-info.component.scss'],
})
export class SkuInfoComponent implements OnInit {
    @Input() set contract(input: contract) {
        if (!!input) this._contract = input;
    }
    _contract: contract;
    constructor(public baseData: BaseDataService) {}

    ngOnInit() {}
}
