import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-td-overflow-text',
    templateUrl: './td-overflow-text.component.html',
    styleUrls: ['./td-overflow-text.component.scss'],
})
export class TdOverflowTextComponent implements OnInit {
    @Input() text: String;
    @Output() close: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    closeTips() {
        this.close.emit(true);
    }
}
