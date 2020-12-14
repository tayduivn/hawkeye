import { GlobalRedoService } from './../../services/global-redo.service';
import { updateSkuData } from './../../component/progress-item-update/progress-item-update.component';
import { ModalOptions } from '@ionic/core';
import { PageEffectService } from '../../services/page-effect.service';
import { BaseDataService } from '../../services/base-data.service';
import { TaskService, contracts, needScheduleParams } from '../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressItemUpdateComponent } from 'src/app/component/progress-item-update/progress-item-update.component';
import { sku } from '../task-add/task-add.page';

@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.page.html',
    styleUrls: ['./track-detail.page.scss'],
})
export class TrackDetailPage implements OnInit {
    type: string;
    random: number = null;
    contract_id: number;
    notUpdate: boolean = false;
    skuList: sku[];
    lastOnce: boolean = true;
    unComplate: orderStatus; //当前 ‘大货包装未完成’ 的那个进度
    statusList: Array<orderStatus>;
    statusListCopy: Array<orderStatus>;
    complate_date: string;
    contract: any = {
        contract_no: '',
        factory_name: '',
        schedule_list_select: [],
        sku_list: [],
    };
    currentTime: string = this.baseData.utilFn.Format('yyyy-MM-dd');
    updateData: updateShedule = {
        user_id: this.baseData.userInfo.id,
        contract_id: null,
        status: [],
        sku_schedule: [],
        estimate_complete_time: '',
    };
    constructor(
        private Router: Router,
        private activeRoute: ActivatedRoute,
        private taskService: TaskService,
        public baseData: BaseDataService,
        private effectCtrl: PageEffectService,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 2012) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((params) => {
            this.type = params.type;
            this.contract_id = params.cid;
            this.updateData.contract_id = params.cid;
        });

        this.activeRoute.data.subscribe((data) => {
            if (this.type == 'set' || this.type == 'history') {
                this.random = Math.random();
                this.statusList = data.data.data.schedule;
                this.skuList = data.data.data.sku_list;
                this.unComplate = this.statusList.length
                    ? this.statusList.find((value) => value.description == '大货部分包装完成')
                    : null;
                this.updateData.sku_schedule = this.filterUpdateSchedule(this.skuList);
                this.statusList.forEach((status) => {
                    if (this.type != 'history') {
                        status.change_time = status.change_time ? status.change_time : '请选择';
                        !status.is_need && (status.is_need = '');
                    } else {
                        status.change_time = status.change_time ? status.change_time : '';
                        !status.is_need && (status.is_need = '未选择');
                    }
                    !status.photo && (status.photo = []);
                    !status.show_photo && (status.show_photo = []);
                });
                this.statusListCopy = JSON.parse(JSON.stringify(this.statusList));
                //如果type是history 则重新排序statusList
                if (this.type == 'history') {
                    this.statusListCopy.sort((a, b) => {
                        return b.status - a.status;
                    });
                }
            } else {
                // debugger
                this.contract = data.data;
                this.statusList = this.takeInverse(data.data.schedule_list_select);
                this.statusList.forEach((value: orderStatus) => {
                    value.meta_is_need = value.is_need ? true : false;
                });
                if (this.baseData.isSystemManger()) {
                    this.notUpdate = false;
                } else {
                    this.notUpdate = true;
                }
                this.statusListCopy = JSON.parse(JSON.stringify(this.statusList));
            }
        });
    }

    takeInverse(statusList: Array<orderStatus>): Array<orderStatus> {
        let some = false;
        statusList.forEach((value: orderStatus) => {
            value.is_need && (some = true);
        });
        if (some) {
            statusList.forEach((value: orderStatus) => {
                value.is_need = value.is_need ? false : true;
            });
        }
        return statusList;
    }

    filterUpdateSchedule(group: sku[]): any {
        let scheduleGroup: any = [];
        scheduleGroup = JSON.parse(JSON.stringify(group));
        scheduleGroup.forEach((value: sku) => {
            delete value.name;
            delete value.pic;
            value.schedule_id = this.unComplate ? this.unComplate.id : null;
        });
        return scheduleGroup;
    }

    choiceStatus(p: orderStatus) {
        if (p.description == '大货部分包装完成' && this.type != 'set-status') {
            this.updateSubItemForm(p);
        }
    }

    updateSubItemForm(p: orderStatus) {
        let option: ModalOptions = {
            component: ProgressItemUpdateComponent,
            componentProps: { sku_list: this.skuList, schedule_id: p.id, type: this.type },
        };
        this.effectCtrl.showModal(option, (data: any) => {
            this.updateData.sku_schedule = data;
            let orderStatus: orderStatus = this.statusListCopy.find((value) => value.description == '大货部分包装完成');
            orderStatus.status = true;
        });
    }

    choice(e: any, p: any) {
        this.baseData.printDebug && console.info(e.target.files[0]); //图片文件
        if (e.target.files.length) {
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e: any) {
                    if (p.show_photo && p.show_photo.length && !p.photo.length) {
                        p.show_photo = [];
                    }
                    p.show_photo.push(this.result);
                    p.photo.push(this.result);
                };
            })(e.target.files[0]);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    blur(p: orderStatus) {
        let metaNotUpdateData = this.statusList.find((value: orderStatus) => value.description == '本周工厂无更新内容'),
            notUpdateData = this.statusListCopy.find((value: orderStatus) => value.description == '本周工厂无更新内容');
        if (metaNotUpdateData && metaNotUpdateData.status && p.status) {
            metaNotUpdateData.status = false;
            notUpdateData.status = false;
        }
    }

    change(p: orderStatus) {
        let status = p.status,
            metaNotUpdateData = this.statusList.find((value: orderStatus) => value.description == '本周工厂无更新内容');
        this.statusList.forEach((orderStatus: orderStatus, index: number) => {
            if (orderStatus.id == this.statusListCopy[index].id) {
                this.statusListCopy[index].status = orderStatus.status;
            }
        });
        this.statusListCopy.forEach((value: orderStatus) => {
            if (value.description == '本周工厂无更新内容') {
                value.status = status;
            }
        });
        if (metaNotUpdateData.status && this.lastOnce) {
            //如果请求数据的 无更新 为选中，则先让notUpdate为反一下 在计算
            this.notUpdate = !this.notUpdate;
            this.lastOnce = false;
        }
        this.notUpdate = !this.notUpdate;
    }

    submit() {
        if (this.type == 'set') {
            this.dataToUpdate();
            this.baseData.printDebug && console.log(this.updateData);
            this.taskService.updateSchedule(this.updateData).subscribe((data) => {
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: data.message,
                });
                if (data.status == 1) {
                    setTimeout(() => {
                        this.effectCtrl.alertCtrl.dismiss();
                        this.Router.navigate(['dashboard/order-track']);
                    }, 1000);
                }
            });
        } else {
            let needScheduleParams: needScheduleParams = {
                contract_id: this.contract_id,
                need_params: [],
            };
            this.statusListCopy.forEach((schedule: orderStatus) => {
                needScheduleParams.need_params.push({
                    is_need: schedule.is_need ? '0' : '1',
                    schedule_id: schedule.id,
                });
            });
            if (this.judgeMaiHeader()) {
                this.taskService.updateNeedSchedule(needScheduleParams).subscribe((data) => {
                    this.effectCtrl.showAlert({
                        header: '提示',
                        message: data.message,
                    });
                    if (data.status == 1) {
                        setTimeout(() => {
                            this.effectCtrl.clearEffectCtrl();
                            this.Router.navigate(['dashboard/order-track']);
                        }, 1000);
                    }
                });
            } else {
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: '唛头必须留一个喔！',
                });
            }
        }
    }

    judgeMaiHeader(): boolean {
        let some = [],
            arr = [];
        this.statusListCopy.forEach((value: orderStatus) => {
            if (
                value.description == '说明书/唛头使用TOBBI品牌' ||
                value.description == '说明书/唛头使用JAXPETY品牌' ||
                value.description == '说明书/唛头无需使用我司指定品牌' ||
                value.description == '说明书/唛头使用SANDINRAYLI品牌'
            ) {
                arr.push(value);
            }
        });
        some = arr.filter((value) => {
            return value.is_need;
        });
        return some.length >= 3 ? true : false;
    }

    setStatusJudgeFn(p: orderStatus) {
        let arr = [
            '说明书/唛头使用TOBBI品牌',
            '说明书/唛头使用JAXPETY品牌',
            '说明书/唛头使用SANDINRAYLI品牌',
            '说明书/唛头无需使用我司指定品牌',
        ];
        if (arr.indexOf(p.description) != -1) {
            if (!p.is_need && this.judgeMaiHeader()) {
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: '唛头必须留一个喔！',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: '我知道了',
                            handler: () => {
                                p.is_need = false;
                                console.log(p);
                                this.effectCtrl.clearEffectCtrl();
                            },
                        },
                    ],
                });
            }
        }
    }

    dataToUpdate() {
        this.statusListCopy.forEach((schedule: orderStatus) => {
            if (schedule.status) {
                this.updateData.status.push({
                    change_time: schedule.change_time == '请选择' ? '' : schedule.change_time,
                    schedule_id: schedule.id,
                    status: schedule.status == true ? 1 : 0,
                    is_need: schedule.is_need,
                    photo: schedule.photo,
                });
            }
        });
    }

    except(p: orderStatus) {
        //三个品牌只能三选一
        let specialStatus: Array<number> = [11, 12, 13, 43];
        if (specialStatus.indexOf(p.id) != -1) {
            switch (p.id) {
                case 11:
                    this.statusListCopy.find((value) => value.id == 12).status = false;
                    this.statusListCopy.find((value) => value.id == 13).status = false;
                    this.statusListCopy.find((value) => value.id == 43).status = false;
                    break;
                case 12:
                    this.statusListCopy.find((value) => value.id == 11).status = false;
                    this.statusListCopy.find((value) => value.id == 13).status = false;
                    this.statusListCopy.find((value) => value.id == 43).status = false;
                    break;
                case 13:
                    this.statusListCopy.find((value) => value.id == 11).status = false;
                    this.statusListCopy.find((value) => value.id == 12).status = false;
                    this.statusListCopy.find((value) => value.id == 43).status = false;
                    break;
                case 43:
                    this.statusListCopy.find((value) => value.id == 11).status = false;
                    this.statusListCopy.find((value) => value.id == 12).status = false;
                    this.statusListCopy.find((value) => value.id == 13).status = false;
            }
        }
    }
}

export interface scheduleOfcid {
    contract_id: number;
    schedule: orderStatus[];
}

export interface orderStatus {
    id?: number;
    created_at?: string;
    schedule_id?: number;
    description?: string;
    create_at?: string;
    status?: any;
    change_time?: string;
    update_time?: string;
    is_need?: number | string | boolean;
    photo?: Array<string>;
    meta_is_need?: boolean;
    details?: string;
    show_photo?: Array<string>;
}

export interface updateShedule {
    user_id: number;
    contract_id: number;
    status: Array<orderStatus>;
    sku_schedule: Array<updateSkuData>;
    estimate_complete_time?: any;
}
