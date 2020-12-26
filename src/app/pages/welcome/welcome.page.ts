import { BaseDataService } from '../../services/base-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.page.html',
    styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
    public userInfo: any = this.baseData.userInfo;
    constructor(public baseData: BaseDataService) {}

    ngOnInit() {
        let that = this;
        console.log(that.userInfo);
    }
}
