import { PageEffectService } from './../../services/page-effect.service';
import { BaseDataService } from './../../services/base-data.service';
import { UserService, userOutData, department } from './../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-add-department',
    templateUrl: './add-department.page.html',
    styleUrls: ['./add-department.page.scss'],
})
export class AddDepartmentPage implements OnInit {
    public goinType: any = {
        pageType: '',
        actionType: '',
    };
    public routeParams: any = {
        id: null,
        type: '',
        list: '',
        utype: 'added',
    };
    public departmentList: department[] = [];
    public currentDepartment: department = {
        create_at: '',
        description: '',
        id: null,
        name: '',
        parent_id: 0,
        status: null,
        type: 0,
        update_at: '',
    };
    public updateDepData: updateDepData = {
        type: 0,
        name: '',
        description: '',
        parent_id: 0,
    };
    public registerForm: FormGroup;
    constructor(
        private activeRoute: ActivatedRoute,
        private userService: UserService,
        private effectCtrl: PageEffectService,
        public baseData: BaseDataService,
    ) {}

    ngOnInit() {
        this.activeRoute.params.subscribe((data: any) => {
            this.goinType.actionType = data.did == 'add' ? '添加' : '编辑';
            this.goinType.pageType = data.type == 'department' ? '部门' : '岗位';
            this.updateDepData.type = data.type == 'department' ? 0 : 1;
            this.routeParams.id = data.did;
            this.routeParams.type = data.type;
            this.routeParams.list = data.list;
            this.routeParams.utype = data.utype;
        });
    }

    ionViewDidEnter() {
        if (this.routeParams.type == 'position' && this.routeParams.id == 'add') {
            this.getDepartmentList();
        } else {
            this.currentDepartment.parent_id = this.routeParams.id == 'add' ? 0 : this.routeParams.id;
        }

        if (
            this.goinType.actionType != '添加' &&
            ((this.routeParams.list == 'post' && this.routeParams.type == 'position') ||
                (this.routeParams.list == 'dep' && this.routeParams.type == 'department'))
        ) {
            this.getDepartmentById();
        }
    }

    getDepartmentList() {
        this.userService.getDepartmentList().subscribe((data: userOutData) => {
            this.departmentList = data.data;
        });
    }

    getDepartmentById() {
        this.userService.getDepById(this.routeParams.id).subscribe((data: userOutData) => {
            this.currentDepartment = data.data;
        });
    }

    submit() {
        this.updateDepData.id = this.currentDepartment.id;
        this.updateDepData.name = this.currentDepartment.name;
        this.updateDepData.description = this.currentDepartment.description;
        this.updateDepData.parent_id = this.currentDepartment.parent_id;
        if (this.routeParams.id == 'add') {
            delete this.updateDepData.id;
        }
        if (this.routeParams.utype == 'added') {
            this.userService.addDepartmentOrPost(this.updateDepData).subscribe((data: any) => {
                this.baseData.printDebug && console.log(data);
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: data.message,
                });
                if (data.status == 1) {
                    setTimeout(() => {
                        this.baseData.utilFn.goBack();
                    }, 1000);
                }
            });
        } else {
            this.userService.upDateDepRole(this.updateDepData).subscribe((data: any) => {
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: data.message,
                });
                if (data.status == 1) {
                    setTimeout(() => {
                        this.baseData.utilFn.goBack();
                    }, 1000);
                }
            });
        }
    }
}

export interface updateDepData {
    type: 0 | 1;    //0是部门 1是岗位
    name: string;
    description: string;
    parent_id: number;
    id?: number | string;
}
