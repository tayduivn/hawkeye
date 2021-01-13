import { Component, OnInit } from '@angular/core';
import { ModalOptions } from '@ionic/core';
import { PageEffectService } from 'src/app/services/page-effect.service';

import { random } from 'types/lodash';
@Component({
    selector: 'app-inspection-storage',
    templateUrl: './inspection-storage.component.html',
    styleUrls: ['./inspection-storage.component.scss'],
})
export class InspectionStorageComponent implements OnInit {
    constructor(private effectCtrl: PageEffectService) {}
    queryInfo: any = {
        page: 1,
        paginate: 10,
    };
    isVisible: boolean = false;
    total: number;
    listOfData = [];
    ngOnInit() {}
    getSearch() {
        // 点击查询
    }
    reset() {
        // 点击重置
    }
    // 页码发生改变触发
    pageChanged() {}
    // 每页数量发生改变触发
    pageSizeChanged() {}
    // 关闭的回调
    handleCancel() {
        this.isVisible = false;
    }
    // 确定的回调
    handleOk() {
        this.isVisible = false;
    }
    // 查看sku详情的按钮
    seeDetail() {
        this.isVisible = true;
    }
    choosePerson() {
        let inputs = [
            {
                name: '监装人',
                type: 'checkbox',
                label: '监装人',
                value: 1,
                checked: false,
                handler: data => {},
            },
        ];
        this.effectCtrl.showAlert({
            header: '选择验货人',
            inputs: inputs,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                },
                {
                    text: '确定',
                    handler: () => {
                        //    调用接口分配
                    },
                },
            ],
        });
    }
    // choiceInspecUser(p: any) {
    //     let inputs = [];
    //     this.inspecUserList.forEach(data => {
    //         inputs.push({
    //             name: data.name,
    //             type: 'checkbox',
    //             label: data.name,
    //             value: data.id,
    //             checked: false,
    //             handler: data => {
    //                 this.baseData.printDebug && console.log(data);
    //             },
    //         });
    //     });
    //     inputs.forEach(element => {
    //         p.inspec_users.forEach(userid => {
    //             if (userid == element.value) {
    //                 element.checked = true;
    //             }
    //         });
    //     });

    //     this.effectCtrl.showAlert({
    //         header: '选择验货人',
    //         inputs: inputs,
    //         buttons: [
    //             {
    //                 text: '取消',
    //                 role: 'cancel',
    //             },
    //             {
    //                 text: '确定',
    //                 handler: (e: Array<number>) => {
    //                     p.user = [];
    //                     p.inspec_users = [];
    //                     e.forEach(d => {
    //                         this.inspecUserList.forEach(user => {
    //                             if (user.id == d) {
    //                                 p.user.push(user.name);
    //                                 p.inspec_users.push(user.id);
    //                                 p.user_can_change = 1;
    //                             }
    //                         });
    //                     });
    //                     this.preDistribInspec(p, 'choicePeople');
    //                 },
    //             },
    //         ],
    //     });
    // }
}
