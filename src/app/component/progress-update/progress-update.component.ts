import { BaseDataService } from 'src/app/services/base-data.service';
import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { ProgressItemUpdateComponent } from '../progress-item-update/progress-item-update.component';
import { orderStatus, updateShedule } from 'src/app/pages/track-detail/track-detail.page';
import { sku } from 'src/app/pages/task-add/task-add.page';
import { TaskService } from 'src/app/services/task.service';

@Component({
    selector: 'app-progress-update',
    templateUrl: './progress-update.component.html',
    styleUrls: ['./progress-update.component.scss'],
})
export class ProgressUpdateComponent implements OnInit {
    @ViewChild('progressItemUpdate', { static: false })
    progressItemUpdate: ProgressItemUpdateComponent;

    visible: boolean = false;

    scheduleList: Array<orderStatus> = [];
    random: number = null;
    unComplete: orderStatus; //当前 ‘大货包装未完成’ 的那个进度

    @Input()
    contractId: number;
    @Input()
    type: 'set' | 'history' = 'set';

    @Output()
    onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();
    updateData: updateShedule = {
        user_id: this.baseData.userInfo.id,
        contract_id: this.contractId,
        status: [],
        sku_schedule: [],
        estimate_complete_time: new Date(),
    };
    tplModal: any;
    skuList: sku[] = [];
     constructor(
        private taskService: TaskService,
        private modalService: NzModalService,
        public baseData: BaseDataService,
    ) {}

    ngOnInit() {
        if (this.type == 'set') {
            this.getScheduleList();
        } else this.getHistoryView();
    }

    getHistoryView() {
        this.taskService.getHistoryDetailByContract(this.contractId).subscribe((data: any) => {
            this.getDataAfterFn(data);
        });
    }

    getScheduleList() {
        this.random = Math.random();
        this.taskService.getScheduleList(this.contractId).subscribe((data: any) => {
            this.getDataAfterFn(data);
        });
    }

    getDataAfterFn(data: any) {
        this.scheduleList = data.data.schedule;
        this.skuList = data.data.sku_list;
        this.unComplete = this.scheduleList.length
            ? this.scheduleList.find(value => value.description == '大货部分包装完成')
            : null;
        this.scheduleList.forEach(status => {
            status.status = status.status ? true : false;
            if (this.type != 'history') {
                status.change_time = status.change_time ? status.change_time : '';
                !status.is_need && (status.is_need = '');
            } else {
                status.change_time = status.change_time ? status.change_time : '';
                !status.is_need && (status.is_need = '未选择');
            }
            !status.photo && (status.photo = []);
            !status.show_photo && (status.show_photo = []);
        });
        if (this.type == 'history') {
            this.scheduleList.sort((a, b) => {
                return b.status - a.status;
            });
        }
        this.baseData.printDebug && console.table(this.scheduleList);
    }

    choice(e: any, p: any) {
        this.baseData.printDebug && console.info(e.target.files[0]); //图片文件
        if (e.target.files.length) {
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(e: any) {
                    if (p.show_photo && p.show_photo.length && p.photo && !p.photo.length) {
                        p.show_photo = [];
                    }
                    p.show_photo.push(this.result);
                    p.photo.push(this.result);
                };
            })(e.target.files[0]);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    filterUpdateSchedule(group: sku[]): any {
        let scheduleGroup: any = [];
        scheduleGroup = JSON.parse(JSON.stringify(group));
        scheduleGroup.forEach((value: sku) => {
            delete value.name;
            delete value.pic;
            value.schedule_id = this.unComplete ? this.unComplete.id : null;
        });
        return scheduleGroup;
    }

    submit() {
        if (this.type == 'set') {
            this.dataToUpdate();
            this.updateData.sku_schedule = this.setUpdate();
            this.updateData.contract_id = this.contractId;
            this.baseData.printDebug && console.log(this.updateData);
            this.taskService.updateSchedule(this.updateData).subscribe(data => {
                let tipsType = data.status ? 'info' : 'error';
                this.modalService[tipsType]({
                    nzTitle: '提示',
                    nzContent: data.message,
                });
                if (data.status == 1) {
                    setTimeout(() => {
                        this.onSubmit.emit(true);
                    }, 1000);
                }
            });
        }
    }

    dataToUpdate() {
        this.scheduleList.forEach((schedule: orderStatus) => {
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

    judgeMaiHeader(): boolean {
        let some = [],
            arr = [];
        this.scheduleList.forEach((value: orderStatus) => {
            if (
                value.description == '说明书/唛头使用TOBBI品牌' ||
                value.description == '说明书/唛头使用JAXPETY品牌' ||
                value.description == '说明书/唛头无需使用我司指定品牌' ||
                value.description == '说明书/唛头使用SANDINRAYLI品牌'
            ) {
                arr.push(value);
            }
        });
        some = arr.filter(value => {
            return value.is_need;
        });
        return some.length >= 3 ? true : false;
    }

    choiceStatus(p: orderStatus) {
        if (p.description == '大货部分包装完成') {
            this.updateSubItemForm(p);
        }
    }

    updateSubItemForm(p: orderStatus) {
        this.visible = true;
    }

    setUpdate(): Array<updateSkuData> {
        let some: Array<updateSkuData> = [];
        this.progressItemUpdate.skuList.forEach((sku: sku) => {
            some.push({
                sku: sku.sku,
                detail_counts: sku.detail_counts,
                complete_counts: sku.complete_counts ? sku.complete_counts : 0,
                complete_time: sku.complete_time ? sku.complete_time : '',
                progress_percent: ((sku.complete_counts ? sku.complete_counts : 0) / sku.detail_counts) * 100 + '%',
                schedule_id: this.unComplete.id,
            });
        });
        return some;
    }
}

export interface updateSkuData {
    sku: string;
    detail_counts: string | number;
    complete_counts: string | number;
    complete_time: string;
    progress_percent: string | number;
    schedule_id: number;
}
