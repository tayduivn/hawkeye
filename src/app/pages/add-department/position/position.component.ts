import { PageEffectService } from './../../../services/page-effect.service';
import { UserService, userOutData, department } from './../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseDataService } from './../../../services/base-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.scss'],
})
export class PositionComponent implements OnInit {
    public positionList: department[] = [];
    public currentDepartment: department = {
        name: '',
    };
    public routeParams: any = {
        did: null,
    };
    constructor(
        public baseData: BaseDataService,
        public userService: UserService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private effectCtrl: PageEffectService,
    ) {}

    ngOnInit() {
        this.activeRoute.params.subscribe((data: any) => {
            this.routeParams.did = data.did;
        });
    }

    ionViewDidEnter() {
        this.getPositionByDep();
    }

    getPositionByDep() {
        this.userService.getPositionByDep(this.routeParams.did).subscribe((data: userOutData) => {
            this.currentDepartment = data.parent;
            this.positionList = data.data;
        });
    }

    delPermission(p: department) {
        this.effectCtrl.showAlert({
            header: '提示',
            message: '确定要删除嘛？',
            buttons: [
                {
                    text: '确定',
                    handler: () => {
                        this.userService.deleteDepOrRole(p.id).subscribe((data) => {
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: data.message,
                            });
                            if (data.status == 1) {
                                let index: number;
                                this.positionList.forEach((position: department, i) => {
                                    if (position.id == p.id) {
                                        index = i;
                                    }
                                });
                                this.positionList.splice(index, 1);
                            }
                        });
                    },
                },
                {
                    text: '取消',
                    role: 'cancel',
                },
            ],
        });
    }

    toDetail(p: department) {
        this.router.navigate(['/create-user'], {
            queryParams: {
                role_id: p.id,
            },
        });
    }
}
