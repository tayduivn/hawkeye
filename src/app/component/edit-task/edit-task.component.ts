import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TransferItem, NzMessageService } from 'ng-zorro-antd';
import { InspectionService, MergeTaskParams } from 'src/app/services/inspection.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
    list: TransferItem[] = [];
    disabled = false;
    index: number = 0;
    tree: Array<any> = [];
    _tasks: Array<any>;
    currentFactory: string = '';
    selectedValue: string = '';
    inspectors: Array<any> = [];
    inspector: any = { id: '', name: '' };
    factoryKeywords: FormControl = new FormControl('');
    treeKeywords: string = '';
    metaTasks: Array<any> = [];
    startTime: Date = null;
    endTime: Date = null;
    constructor(
        private inspect: InspectionService,
        private msg: NzMessageService,
        private effectCtrl: PageEffectService,
    ) {}

    @Output() onComplete: EventEmitter<boolean> = new EventEmitter();

    ngOnInit() {
        this.getList();
        this.inspect.getGroupUserList().subscribe(res => {
            this.inspectors = res.data;
        });
        this.factoryKeywords.valueChanges.pipe(debounceTime(700)).subscribe(res => {
            this._tasks = res ? this._tasks.filter(item => item.title.indexOf(res) !== -1) : this.metaTasks;
        });
    }

    getList() {
        this.inspect.getMergeTaskData().subscribe(res => {
            this._tasks = this.treeFactory(res);
            this.metaTasks = JSON.parse(JSON.stringify(this._tasks));
        });
    }

    select(ret: {}): void {
        console.log('nzSelectChange', ret);
    }

    change(ret: {}): void {}

    onIndexChange(event: number): void {
        this.index = event;
    }

    nzEvent(e: any) {}

    searchFactory() {
        // if (this.factoryKeywords.length) {
        //     this._tasks = this._tasks.filter(item => item.title.indexOf(this.factoryKeywords) !== -1);
        // } else this._tasks = this.metaTasks;
    }

    treeFactory(data: Array<any>): Array<any> {
        let value: Array<any> = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            value.push({
                title: element.factory_name,
                key: element.factory_code ? element.factory_code : index,
                expanded: true,
                children: [],
                disableCheckbox: true,
            });
            if (element.apply_arr && element.apply_arr.length) {
                for (let j = 0; j < element.apply_arr.length; j++) {
                    const data = element.apply_arr[j];
                    value[index].children.push({
                        title: `批次号:    ${data.apply_inspection_no}`,
                        key: data.apply_inspection_no,
                        expanded: true,
                        children: [],
                        disableCheckbox: true,
                    });

                    if (data.contract_arr && data.contract_arr.length) {
                        for (let k = 0; k < data.contract_arr.length; k++) {
                            const contract = data.contract_arr[k];
                            value[index].children[j].children.push({
                                title: `合同号:   ${contract.contract_no}`,
                                key: data.apply_inspection_no + '$' + contract.contract_no,
                                expanded: true,
                                children: [],
                                disableCheckbox: true,
                            });
                            if (contract.sku_arr && contract.sku_arr.length) {
                                for (let p = 0; p < contract.sku_arr.length; p++) {
                                    const sku = contract.sku_arr[p];
                                    value[index].children[j].children[k].children.push({
                                        title: `${sku.sku_chinese} - ${sku.sku}`,
                                        key: data.apply_inspection_no + '$' + contract.contract_no + '&' + sku.sku,
                                        expanded: true,
                                        children: [],
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        return value;
    }

    treeOnChange(e: any) {
        this.treeChecked = e.keys;
    }

    treeChecked: Array<string> = [];

    params: MergeTaskParams = {
        sku_info: [],
        probable_inspection_date: [],
        inspection_user_id_arr: [],
        desc: '',
    };

    onChange(e: any, type: 'start' | 'end') {
        this.params.probable_inspection_date[type === 'start' ? 0 : 1] = e;
    }

    treeKeyChange(e: any) {
        // console.log(e.target.value);
        // if (!e.target.value) {
        //     this.a = false;
        //     setTimeout(() => {
        //         this.a = true;
        //     }, 1000);
        // }
    }

    canClick: boolean = true;

    submit() {
        this.canClick = false;
        this.params.inspection_user_id_arr = []; //先清空
        this.params.sku_info = [];
        this.treeChecked.forEach(node => {
            this.params.sku_info.push({
                apply_inspection_no: node.slice(0, node.indexOf('$')),
                contract_no: node.slice(node.indexOf('$') + 1, node.indexOf('&')),
                sku: node.slice(node.indexOf('&') + 1, node.length),
            });
        });
        for (const key in this.inspector) {
            if (typeof this.inspector[key] === 'number') {
                this.params.inspection_user_id_arr.push(this.inspector[key]);
            }
        }
        if (this.params.sku_info && !this.params.sku_info.length) {
            this.msg.error('请返回上一步勾选SKU！');
            this.index = 1;
            return;
        } else if (this.params.inspection_user_id_arr && !this.params.inspection_user_id_arr.length) {
            this.msg.error('请选择验货人！');
            return;
        } else if (this.params.probable_inspection_date && !this.params.probable_inspection_date.length) {
            this.msg.error('请选择验货时间！');
            return;
        }
        this.inspect.submitMergeData(this.params).subscribe(res => {
            this.canClick = true;
            this.msg[res.status ? 'success' : 'error'](res.message);
            if (res.status) {
                this.index = 0;
                this.currentFactory = null;
                this.getList();
                this.effectCtrl.modalCtrl.dismiss({ refresh: true });

                this.inspector = { id: '', name: '' };
            }
            this.params.sku_info = [];
            this.params.inspection_user_id_arr = [];
            this.params.desc = '';
        });
    }
}
