import { UserService } from '../../services/user.service';
import { BaseDataService, userInfo } from '../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-permission',
    templateUrl: './user-permission.page.html',
    styleUrls: ['./user-permission.page.scss'],
})
export class UserPermissionPage implements OnInit {
    public userList: Array<userInfo>;
    constructor(public baseData: BaseDataService, private userService: UserService, private route: Router) {}

    ngOnInit() {
        this.userService.getUserList().subscribe((userList: any) => {
            this.userList = userList.data.data;
        });
    }

    toDetail(id: number) {
        this.route.navigate(['/user-permission-detail', id]);
    }
}
