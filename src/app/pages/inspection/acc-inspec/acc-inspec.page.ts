import { PageEffectService } from '../../../services/page-effect.service';
import { AccInspObjPipe } from '../../../pipe/acc-insp-obj.pipe';
import { ActivatedRoute } from '@angular/router';
import { BaseDataService } from '../../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { accessOfTaskAndFac, access } from '../../../pages/task-detail/task-detail.page';
import { uploadData, InspectionService } from 'src/app/services/inspection.service';

@Component({
    selector: 'app-acc-inspec',
    templateUrl: './acc-inspec.page.html',
    styleUrls: ['./acc-inspec.page.scss'],
    providers: [AccInspObjPipe],
})
export class AccInspecPage implements OnInit {
    public canLeave: boolean = false;
    public accInspArrayMetadata: Array<accessOfTaskAndFac> = [];
    public accInspArray: Array<accessOfTaskAndFac> = [];
    public title: string;

    constructor(
        public baseData: BaseDataService,
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        private activeRoute: ActivatedRoute,
        public accinspPipe: AccInspObjPipe,
    ) {}

    ngOnInit() {
        this.activeRoute.data.subscribe((data: any) => {
            this.accInspArrayMetadata = data.accInsps;
            this.accInspArray = this.accinspPipe.transform(data.accInsps);
            this.baseData.printDebug && console.log(this.accInspArray);
            let cache: uploadData = {
                contract_id: data.accInsps[0].contract_id,
                task_id: data.accInsps[0].task_id,
                sku: data.accInsps[0].data[0].AccessoryCode,
                parentSku: data.accInsps[0].data[0].ProductCode,
            };
            sessionStorage.setItem('TASK_CONTRACT_INFO', JSON.stringify(cache));
        });
        this.title = JSON.parse(sessionStorage.getItem('TASK_DETAIL_PROJECT')).AccessoryName;
    }

    submit() {
        if (this.canSubmit()) {
            this.inspectService.submitDataAcc(this.accInspArray).subscribe((data) => {
                if (data.status == 1) {
                    this.canLeave = true;
                    this.effectCtrl.showAlert({
                        header: '提示',
                        message: '上传成功',
                        backdropDismiss: false,
                        buttons: [
                            {
                                text: 'OK',
                                handler: () => {
                                    history.go(-1);
                                },
                            },
                        ],
                    });
                }
            });
        } else {
            this.effectCtrl.showAlert({
                header: '提示',
                message: '请完善验货表单！',
            });
        }
    }

    canSubmit(): boolean {
        let some: boolean = true;
        this.accInspArray.forEach((element) => {
            element.data.forEach((acc, j) => {
                for (let key in acc) {
                    if (
                        (key == 'BarCode' || key == 'PackingType' || key == 'AccessoryCode' || key == 'ProductCode') &&
                        (acc[key] == '' || acc[key] == null)
                    ) {
                        some = !some;
                        return some;
                    }
                }
            });
        });
        return some;
    }

    ionViewWillLeave() {
        // sessionStorage.removeItem("INSPECTION_META_DATA")
        sessionStorage.removeItem('TASK_DETAIL_PROJECT');
        sessionStorage.removeItem('TASK_CONTRACT_INFO');
        console.log('4.0 ionViewWillLeave 当将要从页面离开时触发');
    }

    isFormDirty(): boolean {
        // && this.type=='undone'
        let some: boolean = true;
        this.accInspArray.forEach((accessOfTaskAndFac) => {
            accessOfTaskAndFac.data.forEach((access: access) => {
                if ((access.PackingType || access.BarCode) && this.canLeave) {
                    some = false;
                    return;
                }
            });
        });

        return some;
    }
}
