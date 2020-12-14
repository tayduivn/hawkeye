import { GlobalRedoService } from './../../services/global-redo.service';
import { PageEffectService } from '../../services/page-effect.service';
import { AccesslistPipe } from '../../pipe/accesslist.pipe';
import { TaskService } from '../../services/task.service';
import { BaseDataService } from '../../services/base-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { skuObject } from '../../services/task.service';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.page.html',
    styleUrls: ['./task-detail.page.scss'],
    providers: [AccesslistPipe],
})
export class TaskDetailPage implements OnInit {
    task_id: number; //任务id  params
    public factory_group: any; //工厂id  params
    defaultSelect: any; //默认选择的合同

    customAlertOptions: {
        //合同选择框style配置
        header: '请选择合同';
        translucent: true;
    };

    poList: any; //合同 list
    accessList: Array<access> = []; //配件 list
    currentPoId: number; //当前合同id
    public taskDetail: any; //sku list
    constructor(
        public activeRoute: ActivatedRoute,
        public router: Router,
        public baseData: BaseDataService,
        private effectCtrl: PageEffectService,
        public accessPipe: AccesslistPipe,
        public taskService: TaskService,
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
        this.activeRoute.params.subscribe((data) => {
            this.task_id = data.tid;
            this.factory_group = data.fid;
        });

        this.activeRoute.data.subscribe((data) => {
            //TODO : 一种未完成 一种完成的 PO列表
            if (data.poList.length == 0) {
                this.effectCtrl.showAlert({
                    header: '提示',
                    message: '没有数据！',
                    backdropDismiss: false,
                    buttons: [
                        {
                            text: '我知道了',
                            role: 'enter',
                            handler: () => {
                                this.router.navigate(['/welcome']);
                            },
                        },
                    ],
                });
                return;
            }
            // this.taskDetail = this.objToArrayByKey(data.contracts.data)
            this.poList = data.poList; //获取po列表
            this.defaultSelect = data.poList[0];
            this.currentPoId = this.currentPoId ? this.currentPoId : this.defaultSelect.contract_id;
            this.choicePo();
            this.baseData.printDebug && console.log(data);
        });

        this.taskService
            .getAccessbyTaskAndFac({ task_id: this.task_id, contract_id: this.currentPoId }) //获取配件
            .subscribe((data: Array<accessOfTaskAndFac>) => {
                this.accessList = this.accessPipe.transform(data);
                this.baseData.printDebug && console.log(this.accessList);
            });
    }

    toInspection(e: any, type: string) {
        let jumpType = this.factory_group == 'null' ? 'done' : 'undone';
        if (type == 'sku') {
            this.router.navigate(['inspection/sku', this.task_id, e.sku, this.currentPoId, jumpType]);
            sessionStorage.setItem('TASK_DETAIL_PROJECT', JSON.stringify(e));
        } else {
            this.router.navigate(['inspection/acc', this.task_id, this.currentPoId]);
            sessionStorage.setItem('TASK_DETAIL_PROJECT', JSON.stringify(e));
        }
    }

    choicePo() {
        for (let i = 0; i < this.poList.length; i++) {
            if (this.poList[i].contract_id == this.currentPoId) {
                this.defaultSelect = this.poList[i];
            }
        }
        //TODO : 一种未完成 一种完成的 sku列表
        if (this.factory_group == 'null') {
            this.taskService
                .getDoneSkuByTaskAndContract({ task_id: this.task_id, contract_id: this.currentPoId })
                .subscribe((data) => {
                    console.log(data);
                    this.taskDetail = data.data; //this.objToArrayByKey(data.data)
                });
        } else {
            this.taskService.getSkuListByPoAndTask(this.task_id, this.currentPoId).subscribe((data) => {
                console.log(data);
                this.taskDetail = this.objToArrayByKey(data.data);
            });
        }
    }

    objToArrayByKey(obj: skuObject): Array<skuObject> {
        let arr: Array<any> = [];
        for (let i in obj) {
            let o = {};
            o[i] = obj[i];
            o[i].sku = i;
            arr.push(o[i]);
        }
        return arr;
    }

    locatopnCompare(a: any, b: any) {
        if (a.contract_id == b.contract_id) {
            return true;
        }
        return false;
    }
}

export interface accessOfTaskAndFac {
    contract_id: number;
    task_id: string | number;
    data: Array<access>;
}

export interface access {
    contract_id: number;
    AccessoryCode: string;
    AccessoryName: string;
    BarCode: string;
    ChineseDescription: string;
    PackingType: string;
    ProductCode: string;
    StockDetailNum: number;
}
