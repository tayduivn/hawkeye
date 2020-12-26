import { GlobalRedoService } from './../../services/global-redo.service';
import { BaseDataService } from './../../services/base-data.service';
import { PageEffectService } from './../../services/page-effect.service';
import { InspectionService } from './../../services/inspection.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-get-contract',
    templateUrl: './get-contract.page.html',
    styleUrls: ['./get-contract.page.scss'],
})
export class GetContractPage implements OnInit {
    public requested: any = {
        isGetted: false,
        isUpdate: false,
    };

    constructor(
        private inspectService: InspectionService,
        private effectCtrl: PageEffectService,
        public baseData: BaseDataService,
        private route: Router,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 202) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.requested.isGetted = false;
        this.requested.isUpdate = false;
    }

    ionViewDidEnter() {}

    getContract() {
        this.requested.isGetted = !this.requested.isGetted;
        this.inspectService.getContractList().subscribe((data: any) => {
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                setTimeout(() => {
                    this.route.navigate(['dashboard/order-track']);
                }, 1000);
            }
        });
    }

    updateStatus() {
        this.requested.isUpdate = !this.requested.isUpdate;
        this.inspectService.updateStatus()
        .subscribe((data:any)=>{
            this.effectCtrl.showAlert({
              header:'提示',
              message:data.message
            })
            if(data.status == 1){
              setTimeout(()=>{
                this.route.navigate(['/order-track'])
              },1000)
            }
        })
        this.effectCtrl.showAlert({
            header: '提示',
            message: '更新中……',
        });
    }
}
