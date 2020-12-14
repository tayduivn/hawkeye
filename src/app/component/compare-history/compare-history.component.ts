import { environment } from './../../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-compare-history',
    templateUrl: './compare-history.component.html',
    styleUrls: ['./compare-history.component.scss'],
})
export class CompareHistoryComponent implements OnInit {
    @Input() type: 'pic' | 'video' | 'desc' | 'value';

    @Input() set data(input: any) {
        this._data = input;
        console.log(input);
    }

    _data: any[] = [];
    imgOrigin: string = environment.usFileUrl;
    constructor() {}

    ngOnInit() {}
}
