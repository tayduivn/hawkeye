import { BaseDataService } from 'src/app/services/base-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-inspec-task-mobile',
    templateUrl: './inspec-task-mobile.component.html',
    styleUrls: ['./inspec-task-mobile.component.scss'],
})
export class InspecTaskMobileComponent implements OnInit {
    constructor(public baseData: BaseDataService) {}

    ngOnInit() {}
}
