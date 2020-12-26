import { GlobalRedoService } from './../../services/global-redo.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { InspectionService, distribFromParams } from 'src/app/services/inspection.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ModalOptions } from '@ionic/core';
import { CustomPopupComponent } from 'src/app/component/custom-popup/custom-popup.component';
import { BaseDataService } from 'src/app/services/base-data.service';

@Component({
    selector: 'app-distrib-inspec-to-user',
    templateUrl: './distrib-inspec-to-user.component.html',
    styleUrls: ['./distrib-inspec-to-user.component.scss'],
})
export class DistribInspecToUserComponent implements OnInit {
    userList: Array<any> = [];
    swiperConfig: SwiperConfigInterface = {};
    type: 'list' | 'input';
    public currentTime: string = this.baseData.utilFn.Format('yyyy-MM-dd');
    group: any = [];
    inspec_user_list: Array<number> = [];
    groupId: number;
    updateParams: distribFromParams = {
        probable_inspection_date: [],
        inspection_group_id: null,
        user_id: [],
        desc: '',
    };

    constructor(
        public baseData: BaseDataService,
        private effectCtrl: PageEffectService,
        private inspectService: InspectionService,
        private activeRoute: ActivatedRoute,
        private route: Router,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe((res) => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 2081) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((data) => {
            this.updateParams.inspection_group_id = data.did;
            this.type = data.type;
            this.group = JSON.parse(sessionStorage.getItem('DISTRIB-CONTRACT-INFO')).apply_inspections.data;
            this.inspec_user_list = JSON.parse(sessionStorage.getItem('DISTRIB-CONTRACT-INFO')).user_id
                ? JSON.parse(sessionStorage.getItem('DISTRIB-CONTRACT-INFO')).user_id
                : [];
        });
    }

    ionViewWillEnter() {
        this.getUserList();
        this.swiperConfig = this.baseData.utilFn.getSwiperPublicConfig();
    }

    getUserList() {
        this.inspectService.getGroupUserList().subscribe((data: any) => {
            this.userList = data.data;
            this.inspec_user_list &&
                this.userList.forEach((element) => {
                    this.inspec_user_list.forEach((userId) => {
                        if (element.id == userId) {
                            element.choice = true;
                        }
                    });
                });
            this.baseData.printDebug && console.log(this.userList);
        });
    }

    selectUser(p: any) {
        this.updateParams.user_id = [];
        this.baseData.printDebug && console.table(this.userList);
        this.userList.forEach((data: any) => {
            data.choice && this.updateParams.user_id.push(data.id);
        });
    }

    // selectDate(p:any){
    //   this.updateParams.probable_inspection_date = []
    //   this.group.forEach(element => {
    //     element.early_date_start && this.updateParams.probable_inspection_date.push({
    //       date_start:element.early_date_start,
    //       date_end:element.early_date_end,
    //       apply_id:element.id
    //     })
    //   })
    //   this.baseData.printDebug && console.table(this.updateParams.probable_inspection_date      )
    // }

    seeSku(p: any) {
        let option: ModalOptions = { 
            component: CustomPopupComponent,
            cssClass: 'modal_a',
            componentProps: { contract: p, showType: 'list' },
        };
        this.effectCtrl.showModal(option);
    }

    revokeTask(p: any, type: 'group' | 'contract') {
        //撤销验货
        this.effectCtrl.showAlert({
            header: '提示',
            message: '确定要撤销此合同吗？',
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        this.inspectService.cancelInspectionGroup(p.contract_id, type).subscribe((data) => {
                            this.effectCtrl.showAlert({
                                header: '提示',
                                message: data.message,
                            });
                            if (data.status == 1) {
                                setTimeout(() => {
                                    this.getUserList();
                                });
                            }
                        });
                    },
                },
            ],
        });
    }

    ionViewDidLeave() {
        sessionStorage.removeItem('DISTRIB-CONTRACT-LIST');
    }

    submit() {
        this.updateParams.probable_inspection_date = [];
        this.group.forEach((element) => {
            if (element.early_date_start || element.contract_desc) {
                this.updateParams.probable_inspection_date.push({
                    date_start: element.early_date_start,
                    date_end: element.early_date_end,
                    contract_desc: element.contract_desc,
                    apply_id: element.id,
                });
            }
        });
        this.baseData.printDebug && console.table(this.updateParams.probable_inspection_date);

        this.inspectService.selectGroupUser(this.updateParams).subscribe((data) => {
            this.baseData.printDebug && console.log(data);
            this.effectCtrl.showAlert({
                header: '提示',
                message: data.message,
            });
            if (data.status == 1) {
                setTimeout(() => {
                    this.route.navigate(['dashboard/distrib-inspec']);
                }, 1000);
            }
        });
    }
}
