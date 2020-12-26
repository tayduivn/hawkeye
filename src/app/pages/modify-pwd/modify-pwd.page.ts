import { PageEffectService } from '../../services/page-effect.service';
import { AlertController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BaseDataService } from '../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-modify-pwd',
    templateUrl: './modify-pwd.page.html',
    styleUrls: ['./modify-pwd.page.scss'],
})
export class ModifyPwdPage implements OnInit {
    public modifyPwdObj: modifyPwd = { password: '', oldpassword: '', password_confirmation: '' };
    public registerForm: FormGroup;
    public verifi: any = {
        oldpassword: null,
        password: null,
        password_confirmation: null,
    };
    constructor(
        public baseData: BaseDataService,
        public toastCtrl: ToastController,
        public effectCtrl: PageEffectService,
        private router: Router,
        public formBuilder: FormBuilder,
        
    ) {
        this.registerForm = formBuilder.group({
            oldpassword: ['', Validators.compose([Validators.required])], //Validators.maxLength(5)
            password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
            password_confirmation: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
        });
        this.verifi.oldpassword = this.registerForm.controls['oldpassword'];
        this.verifi.password = this.registerForm.controls['password'];
        this.verifi.password_confirmation = this.registerForm.controls['password_confirmation'];
    }

    ngOnInit() {}

    modifyPwd() {
        if (this.modifyPwdObj.password === this.modifyPwdObj.password_confirmation) {
            this.effectCtrl.showLoad({ duration: 2000, message: '正在修改…', translucent: true }).then(() => {
                let params: modifyPwd = JSON.parse(JSON.stringify(this.modifyPwdObj));
                delete params.password_confirmation;
                this.baseData.post({ url: '/reset', params: params }, true).subscribe((data) => {
                    this.effectCtrl.clearEffectCtrl();
                    this.effectCtrl.showAlert({
                        header: '提示',
                        message: data.message,
                    });
                    if (data.status == 1) {
                        setTimeout(() => {
                            sessionStorage.removeItem('USERINFO');
                            sessionStorage.removeItem('PERMISSION');
                            this.router.navigate(['/login']);
                        }, 1000);
                    }
                });
            });
        } else {
            this.effectCtrl.showAlert({
                header: '提示',
                message: '两次输入不一致',
            });
        }
    }

    ionViewWillLeave() {
        if (this.modifyPwdObj.oldpassword || this.modifyPwdObj.password || this.modifyPwdObj.password_confirmation) {
            //todo 没保存提示离开
        }
    }
}

export interface modifyPwd {
    oldpassword: string;
    password: string;
    password_confirmation: string;
}
