import { BaseDataService } from './../../services/base-data.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { needScheduleParams, TaskService } from 'src/app/services/task.service';
import { orderStatus } from 'src/app/pages/track-detail/track-detail.page';

@Component({
    selector: 'app-track-exclude',
    templateUrl: './track-exclude.component.html',
    styleUrls: ['./track-exclude.component.scss'],
})
export class TrackExcludeComponent implements OnInit {
    drawerStatus: boolean = false;
    contract: any = {
        contract_no: '',
        factory_name: '',
        schedule_list_select: [],
        sku_list: [],
    };
    @Input()
    currentContract: any;
    @Output() emitStatusFn: EventEmitter<boolean> = new EventEmitter();

    @Output()
    onSubmit: EventEmitter<boolean> = new EventEmitter<boolean>();
    constructor(
        private taskService: TaskService,
        private modalService: NzModalService,
        public baseData: BaseDataService,
        private message: NzMessageService,
    ) {}

    ngOnInit() {
        this.taskService.getNeedSchedule(this.currentContract.id).subscribe((data: any) => {
            data.schedule_list_select = this.takeInverse(data.schedule_list_select);
            data.schedule_list_select.forEach(data => {
                data.meta_is_need = data.is_need ? true : false;
            });
            this.contract = data;
            this.baseData.printDebug && console.log(data);
        });
    }

    scheduleEditSubmit() {
        //提交 进度排除项 的内容
        let needScheduleParams: needScheduleParams = {
            contract_id: this.currentContract.id,
            need_params: [],
        };
        this.contract.schedule_list_select.forEach((schedule: orderStatus) => {
            needScheduleParams.need_params.push({
                is_need: schedule.is_need ? '0' : '1',
                schedule_id: schedule.id,
            });
        });
        if (this.judgeMaiHeader()) {
            this.taskService.updateNeedSchedule(needScheduleParams).subscribe(data => {
                this.modalService.info({
                    nzTitle: '提示',
                    nzContent: data.message,
                });
                if (data.status == 1) {
                    setTimeout(() => {
                        this.onSubmit.emit(true);
                    }, 1000);
                }
            });
        } else {
            this.modalService.error({
                nzTitle: '提示',
                nzContent: '唛头必须留一个喔！',
            });
        }
    }

    judgeMaiHeader(): boolean {
        //判断是有留有一个唛头 （合规）
        let some = [],
            arr = [];
        this.contract.schedule_list_select.forEach((value: orderStatus) => {
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
        return some.length > 2 ? true : false;
    }

    takeInverse(statusList: Array<orderStatus>): Array<orderStatus> {
        //修改过后的状态 服务器返回的是相反的
        let some = false;
        statusList.forEach((value: orderStatus) => {
            value.is_need && (some = true);
        });
        if (some) {
            statusList.forEach((value: orderStatus) => {
                value.is_need = value.is_need ? false : true;
            });
        } else {
            statusList.forEach((value: orderStatus) => {
                value.is_need = value.is_need ? true : false;
            });
        }
        return statusList;
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
                this.modalService.error({
                    nzTitle: '提示',
                    nzContent: '唛头必须留一个喔！',
                    nzOnOk: () => {
                        debugger;
                        p.is_need = false;
                    },
                });
            }
        }
    }

    consoles(e) {
        console.log(e);
    }

    emit(value: boolean) {
        this.emitStatusFn.emit(value);
    }

    reset() {}

    confirm() {
        this.taskService.resetSchedule(this.currentContract.id).subscribe(res => {
            if (res.status) {
                this.contract.schedule_list_select.forEach(schedule => {
                    schedule.is_need = false;
                });
                this.message.success('更新成功');
            } else this.message.success('更新失败');
            this.onSubmit.emit(true);
        });
    }

    cancel() {}
}
