import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
    icon: string = 'more';
    value: string = '';

    @Input()
    sortName: string;
    @Input()
    sortField: string;

    sortObj: sortObj = {
        name: this.sortName,
        value: '',
    };
    @Output() outFn: EventEmitter<sortObj> = new EventEmitter();
    constructor() {}

    change() {
        this.sortObj.name = this.sortField;
        switch (this.value) {
            case 'desc':
                this.value = 'asc';
                this.icon = 'arrow-dropup';
                this.sortObj.value = 'asc';
                break;
            case 'asc':
                this.value = '';
                this.icon = 'more';
                this.sortObj.value = '';
                break;
            case '':
                this.value = 'desc';
                this.icon = 'arrow-dropdown';
                this.sortObj.value = 'desc';
        }
        this.outFn.emit(this.sortObj);
    }

    ngOnInit() {}
}

export interface sortObj {
    value: string;
    name: string;
}
