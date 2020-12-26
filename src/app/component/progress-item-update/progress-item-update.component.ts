import { environment } from './../../../environments/environment';
import { NzModalService } from 'ng-zorro-antd';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { sku } from 'src/app/pages/task-add/task-add.page';

@Component({
    selector: 'app-progress-item-update',
    templateUrl: './progress-item-update.component.html',
    styleUrls: ['./progress-item-update.component.scss'],
})
export class ProgressItemUpdateComponent implements OnInit {
    fileUrl: string = environment.fileUrlPath;
    chipboardDestroy: boolean = true;
    @Input() skuList: sku[] = [];
    @Input() schedule_id: number;
    @Input() type: 'history' | 'set';
    outputSkuList: updateSkuData[];
    constructor(private modalService: NzModalService, public baseData: BaseDataService) {}

    ngOnInit() {}

    enter(type: 'enter' | 'cancel') {
        if (type == 'enter') {
            let nodata: boolean = false;
            for (var i = 0; i < this.skuList.length; i++) {
                if (this.skuList[i].complete_counts) nodata = true;
            }
            if (!nodata) {
                this.modalService.error({ nzTitle: '提示', nzContent: '请完善表单' });
                return;
            }
            if (this.formVerific()) {
                this.outputSkuList = this.setUpdate();
            }
        }
    }

    inspectIptVer(sku: sku) {
        if (sku.complete_counts > sku.detail_counts) {
            this.modalService.error({
                nzTitle: '提示',
                nzContent: '请完善表单',
                nzOkText: '重新输入',
                nzOnOk: () => {
                    sku.complete_counts = null;
                },
            });
        }
    }

    setUpdate(): Array<updateSkuData> {
        let some: Array<updateSkuData> = [];
        this.skuList.forEach((sku: sku) => {
            some.push({
                sku: sku.sku,
                detail_counts: sku.detail_counts,
                complete_counts: sku.complete_counts ? sku.complete_counts : 0,
                complete_time: sku.complete_time ? sku.complete_time : '',
                progress_percent: ((sku.complete_counts ? sku.complete_counts : 0) / sku.detail_counts) * 100 + '%',
                schedule_id: this.schedule_id,
            });
        });
        return some;
    }

    formVerific(): boolean {
        let tips: string = '',
            some: boolean = true;
        this.skuList.forEach((sku: sku) => {
            if (sku.complete_counts && !sku.complete_time) {
                tips += `<p class='tips'>${sku.name} 的验货时间</p>\n`;
                some = false;
            }
        });
        !some &&
            this.modalService.error({
                nzTitle: '请填写',
                nzContent: tips,
            });
        return some;
    }

    setChipboardDestroy(e: boolean) {
        this.chipboardDestroy = e;
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
