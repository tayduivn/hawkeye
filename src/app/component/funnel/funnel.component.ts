import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-funnel',
    templateUrl: './funnel.component.html',
    styleUrls: ['./funnel.component.scss'],
})
export class FunnelComponent implements OnInit {
    @Input() set list(input: Array<{ key: string; value: string }>) {
        if (!!input) this._list = input;
    }

    @Output() onSelected: EventEmitter<{ label: string; value: string }> = new EventEmitter();

    _list: Array<{ key: string; value: string }> = [];
    constructor() {}

    ngOnInit() {}

    openSelector() {}
}
