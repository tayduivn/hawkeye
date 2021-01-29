import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataService } from 'src/app/services/base-data.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { reimbursement } from 'src/app/services/reimbursement.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-reimbursement-management-details',
    templateUrl: './reimbursement-management-details.component.html',
    styleUrls: ['./reimbursement-management-details.component.scss'],
})
export class ReimbursementManagementDetailsComponent implements OnInit {
    constructor(
        public baseData: BaseDataService,
        private acRoute: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        private travel: reimbursement,
        private es: PageEffectService,
    ) {}
    type: string = ''; //驾车的类型
    obs$: any;
    obs$1: any;
    obs$2: any;
    details: any = {};
    imgOrigin = environment.usFileUrl.replace('/storage', '');
    ngOnInit() {
        this.obs$ = this.acRoute.url.subscribe(res => {
            if (res[0].path == 'reimbursement-management-details') {
                this.init();
            }
        });
    }
    init() {
        this.obs$1 = this.activatedRoute.queryParams.subscribe(res => {
            console.log(res);
            // 获取详情
            this.obs$2 = this.travel
                .getDetails({
                    travel_id: res.id - 0,
                })
                .subscribe(res => {
                    console.log(res);
                    if (res.status != 1)
                        return this.es.showToast({
                            message: res.message,
                            color: 'danger',
                            duration: 1500,
                        });
                    // 获取成功解构出数据
                    const { data: details } = res;
                    console.log(details);
                    this.details = details;
                });
        });
    }

    back(): void {
        this.obs$1.unsubscribe();
        // 返回主页的时候取消订阅，刷新主页
        this.obs$2.unsubscribe();
    }
}
