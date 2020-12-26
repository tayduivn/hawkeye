import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
    @Input() total: number;
    @Input() current: number;
    constructor() {}

    ngOnInit() {}
}
