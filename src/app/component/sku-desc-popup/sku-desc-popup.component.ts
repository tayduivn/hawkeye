import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-sku-desc-popup',
    templateUrl: './sku-desc-popup.component.html',
    styleUrls: ['./sku-desc-popup.component.scss'],
})
export class SkuDescPopupComponent implements OnInit {
    @Input() skuDesc: any[];
    constructor() {}

    ngOnInit() {}
}
