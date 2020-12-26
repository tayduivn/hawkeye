import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
    constructor(public baseData: BaseDataService) {}

    ngOnInit() {}
}
