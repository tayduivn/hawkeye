import { GlobalRedoService } from './../../services/global-redo.service';
import { UserService } from '../../services/user.service';
import { PageEffectService } from '../../services/page-effect.service';
import { TaskService } from '../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { userInfo, BaseDataService } from '../../services/base-data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-task-add',
    templateUrl: './task-add.page.html',
    styleUrls: ['./task-add.page.scss'],
})
export class TaskAddPage implements OnInit {
    currentTime: string = this.baseData.utilFn.Format('yyyy-MM-dd');
    defaultUser: userInfo = {
        name: '',
        id: null,
        api_token: '',
        email: '',
    };
    userList: Array<userInfo>;
    public metaData: addMetaData = {
        user_id: null,
        data: [
            {
                factory_name: '',
                contract_no: [
                    {
                        no: '',
                        inspection_date: this.currentTime,
                        sku: [
                            {
                                name: '',
                                num: 1,
                            },
                        ],
                    },
                ],
            },
        ],
    };

    constructor(
        private taskService: TaskService,
        private userService: UserService,
        private effectCtrl: PageEffectService,
        public baseData: BaseDataService,
        private Router: Router,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (location.href.indexOf(res.path) != -1 || location.href.indexOf(res.parent) != -1) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.userService.getUserList().subscribe((data: Array<userInfo>) => {
            this.userList = data;
            this.defaultUser = this.userList[0];
            console.log(data);
        });
    }

    timeChange() {
        console.log(this.metaData);
    }

    addSku(factory_i: number, contract_i: number, sku_i: number) {
        if (sku_i >= 4) {
            this.effectCtrl.showAlert({
                message: '最多可添加5个sku',
                header: '提示',
            });
            return;
        }
        this.metaData.data[factory_i].contract_no[contract_i].sku.push({
            name: '',
            num: 1,
        });
    }

    addContract(factory_i: number, contract_i: number) {
        if (contract_i >= 2) {
            this.effectCtrl.showAlert({
                header: '提示',
                message: '最多可添加3个合同',
            });
            return;
        }
        this.metaData.data[factory_i].contract_no.push({
            no: '',
            inspection_date: this.currentTime,
            sku: [
                {
                    name: '',
                    num: 1,
                },
            ],
        });
    }

    uploadTask() {
        this.taskService.uploadTask(this.metaData).subscribe((data) => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                this.effectCtrl.alertCtrl.dismiss();
                setTimeout(() => {
                    this.Router.navigate(['task/undone']);
                }, 1000);
            }
        });
    }

    goBack() {
        history.go(-1);
    }

    choiceUser() {
        this.defaultUser = this.userList.find((t) => t.id == this.metaData.user_id);
    }

    dateFormat(): string {
        let currentTime: string,
            current = this.baseData.utilFn.Format('yyyy-MM-dd').split('');
        current = current.map((t) => {
            if (t == ' ') t = 'T';
            return t;
        });
        current.push('Z');
        currentTime = current.join('');
        return currentTime;
    }

    ionViewCanLeave() {
        this.effectCtrl.clearEffectCtrl();
        console.log('ionViewCanLeave');
    }

    locationCompare(a: any, b: any) {
        if (a.id == b.id) {
            return true;
        }
        return false;
    }
}

export interface addMetaData {
    user_id: number;
    data: Array<factory>;
}

interface factory {
    contract_no: Array<contract>;
    factory_name: string;
}

export interface contract {
    no: string;
    inspection_date: any;
    sku: Array<sku>;
}

export interface sku {
    name: string;
    isNew?: number | string;
    Count?: number;
    detail_counts?: number;
    pic?: string;
    num?: number;
    sku?: string;
    contract_no?: string;
    description?: any;
    temporary_description?: string;
    numIsCom?: number | string; //验货数量是否完成
    photo?: string[];
    complete_counts?: number;
    complete_time?: string;
    schedule_id?: number;
    inspection_left_num?: number; //验货剩余数量
    group?: any;
    is_need_drop_test?: any;
    has_strap?: any;
    is_need_sample?: any;
    news_or_return_product?: any;
    warehouse?:'USA'|'AUE';
    logo_desc?: string;
    estimated_loading_time?: string;
    must_quantity?: number;
    sku_description?: string;
    skuCanceled?: boolean;
    id?: number;
    need_bring_back_instructor ? :any
}
