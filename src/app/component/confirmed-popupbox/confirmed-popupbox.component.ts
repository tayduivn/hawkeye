import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-confirmed-popupbox',
    templateUrl: './confirmed-popupbox.component.html',
    styleUrls: ['./confirmed-popupbox.component.scss'],
})
export class ConfirmedPopupBoxComponent implements OnInit {
    @Input() contract: any;

    constructor() {}

    ngOnInit() {
        console.log(this.contract);
    }
}
