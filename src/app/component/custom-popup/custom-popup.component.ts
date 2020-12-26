import { PageEffectService } from '../../services/page-effect.service';
import { BaseDataService } from '../../services/base-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { sku } from 'src/app/pages/task-add/task-add.page';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { InspectionService } from 'src/app/services/inspection.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-custom-popup',
    templateUrl: 'custom-popup.component.html',
    styleUrls: ['custom-popup.component.scss'],
})
export class CustomPopupComponent implements OnInit {
    loading: boolean = false;
    chipboardDestroy: boolean = true;
    public currentTime: string = this.baseData.utilFn.Format('yyyy-MM-dd');
    use_estimated_loading_time: boolean = true;
    estimated_loading_time: string = this.baseData.utilFn.Format('yyyy-MM-dd');
    timeChange: boolean = false;
    is_new_factory: any = '';

    @Input() set contract(input: any) {
        if (!!input) {
            this._contract = input;
            (this._contract.sku_list ? this._contract.sku_list : this._contract.sku_num).forEach((element, i) => {
                element.index = i;
            });
        }
    }

    _contract: any;

    @Input() set applyInspectId(input: number) {
        if (!!input) this._applyInspectId = input;
    }

    @Input() showBtnGroup: any;

    _applyInspectId: number;

    public sku_list: sku[];
    config: SwiperConfigInterface = {};
    @Input()
    showType: 'input' | 'list';

    @Input() showCancel?: boolean = true;

    public data: any = {
        data: {
            inspection_date: this.currentTime,
            estimated_loading_time: this.estimated_loading_time,
            is_new_factory: this.is_new_factory,
            content: [],
        },
    };

    constructor(
        private inspectService: InspectionService,
        public baseData: BaseDataService,
        private effectCtrl: PageEffectService,
        private msg: NzMessageService,
    ) {}

    ngOnInit() {
        this.sku_list =
            this._contract.sku_list && this._contract.sku_list.length
                ? this._contract.sku_list
                : this._contract.sku_num;
        this.data.data.content = JSON.parse(JSON.stringify(this.sku_list));
        this.data.data.content.forEach((sku: sku, i) => {
            let description = [];
            sku.numIsCom = '';
            sku.isNew = '';
            sku.group = '';
            sku.is_need_drop_test = sku.is_need_drop_test ? sku.is_need_drop_test : '';
            sku.has_strap = sku.has_strap ? sku.has_strap : '';
            sku.is_need_sample = sku.is_need_sample ? sku.is_need_sample : '';
            sku.need_bring_back_instructor = sku.need_bring_back_instructor ? sku.need_bring_back_instructor : '';
            sku.news_or_return_product = sku.news_or_return_product ? sku.news_or_return_product : '';
            (sku.photo = sku.photo && sku.photo.length ? sku.photo : []),
                (sku.description =
                    typeof sku.description == 'string'
                        ? [sku.description]
                        : description.concat(sku.description ? sku.description : ['']));
            sku.description.forEach((desc, j) => {
                this._descriptionAry[i] = { [j]: desc };
            });
        });
        this.baseData.printDebug && console.log(this.data.data);
    }

    _descriptionAry: Array<any> = [];

    enter(type: 'cancel' | 'enter') {
        if (type == 'enter') {
            let upDateData: any = JSON.parse(JSON.stringify(this.data)),
                upDateSkuData: upDateSkuData[] = [];

            this.data.data.content.forEach((sku: sku, i: number) => {
                upDateSkuData.push({
                    complete: sku.numIsCom,
                    quantity: sku.num || 0,
                    sku: sku.sku,
                    isNew: sku.isNew,
                    group: sku.group,
                    photo: sku.photo,
                    logo_desc: sku.logo_desc,
                    is_need_drop_test: sku.is_need_drop_test,
                    has_strap: sku.has_strap,
                    is_need_sample: sku.is_need_sample,
                    need_bring_back_instructor: sku.need_bring_back_instructor,
                    must_quantity: sku.must_quantity || 0,
                    warehouse: sku.warehouse,
                    // estimated_loading_time:sku.estimate未提交质检部d_loading_time,
                    news_or_return_product: sku.news_or_return_product,
                    description: this.getAryToObj(this._descriptionAry[i]),
                });
            });
            upDateData.data.inspection_date = this.currentTime;
            upDateData.data.is_new_factory = this.is_new_factory;
            upDateData.data.estimated_loading_time = this.estimated_loading_time;
            upDateData.data.content = upDateSkuData;
            this.effectCtrl.modalCtrl.dismiss({
                refresh: upDateData,
            });
        } else {
            this.effectCtrl.modalCtrl.dismiss();
        }
    }

    regValid(e: any) {
        if (!/^(?!0+(?:\0+)?$)(?:[1-9]\d*|0)(?:\\d{1,2})?$/.test(e.target.value)) {
            e.target.value = null;
        }
    }

    getAryToObj(obj: any) {
        let ary = [];
        for (var key in obj) {
            ary.push(obj[key]);
        }
        return ary;
    }

    choice(e: any, p: upDateSkuData) {
        if (e.target.files.length) {
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(e: any) {
                    p.photo.push(this.result);
                };
            })(e.target.files[0]);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    toggleStatus() {
        if (this.use_estimated_loading_time) {
            this.estimated_loading_time = this.baseData.utilFn.Format('yyyy-MM-dd');
        } else {
            this.estimated_loading_time = '';
        }
    }

    inspectIptVer(sku: sku, p: string) {
        let msg: string = '';
        if (p === 'num' && sku[p] > sku.inspection_left_num) {
            msg = '验货数量不能大于剩余数量喔,请重新输入';
        } else if (p === 'must_quantity' && sku[p] > sku.num) {
            msg = '抽检数量不能大于验货数量喔,请重新输入';
        }

        if (!msg) return;
        this.effectCtrl.showAlert({
            header: '提示',
            backdropDismiss: false,
            message: msg,
            buttons: [
                {
                    text: '重新输入',
                    handler: () => {
                        sku[p] = null;
                    },
                },
            ],
        });
    }

    setChipboardDestroy(e: boolean) {
        this.chipboardDestroy = e;
    }

    ionViewWillEnter() {
        this.config = this.baseData.utilFn.getSwiperPublicConfig();
        this.config.mousewheel = false;
    }

    applyInspectModifyDesc(p: sku) {
        this.inspectService
            .applyInspectModifyDesc({
                apply_id: this._applyInspectId,
                sku: p.sku,
                temporary_description: p.temporary_description,
            })
            .subscribe(res => {
                this.effectCtrl.showAlert({
                    message: res.message,
                });
            });
    }

    revoke(p: sku,i: number){
        console.log(p,this._applyInspectId);
        const params = {
            apply_id: this._applyInspectId,
            sku: p.sku
        }
        this.inspectService.revokeInspect(params)
            .subscribe(res => {
                console.log(res)
                this.msg[res.status?'success':'danger'](res.message);
                if(res.status){
                    this.data.data.content.splice(i,1)
                    this.data.data.content = [...this.data.data.content];
                    this.effectCtrl.modalCtrl.dismiss({
                        refresh: true,
                    });
                }
            })
    }

    cancelInspect(item: sku) {
        this.inspectService.skuCancelInspect(item.sku, this._applyInspectId).subscribe(res => {
            if (res.status == 1) {
                item.skuCanceled = true;
            }
            this.msg[res.status ? 'success' : 'error'](res.message);
        });
    }

    onscroll(e: any) {
        document.getElementById('fixed-thead').setAttribute('style', `transform:translateY(${e.target.scrollTop}px)`);
    }
}

export interface upDateSkuData {
    complete: number | string;
    description: string[];
    quantity: number;
    sku: string;
    isNew: number | string;
    group?: any;
    photo: string[];
    logo_desc?: string;
    is_need_drop_test?: number;
    has_strap?: number;
    is_need_sample?: number;
    estimated_loading_time?: string;
    need_bring_back_instructor?: any;
    news_or_return_product?: number;
    must_quantity?: number;
    warehouse?: 'USA' | 'AUE';
}
