import { BaseDataService } from '../../services/base-data.service';
import { Component, OnInit, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateRex } from './validate-register';
import { PageEffectService } from '../../services/page-effect.service';
import { Permission } from 'src/app/services/permission.service';
import { MenuPermissionService } from 'src/app/services/menu-permission.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
    public status: string = 'login';
    public loginInfo: loginInfo = new loginInfo('', '', '', '');

    // 定义表单
    public registerForm: FormGroup;

    // 表单验证不通过时显示的错误消息
    public formErrors = {
        username: '',
        company_no: '',
        password: '',
        password_confirmation: '',
    };

    // 为每一项表单验证添加说明文字
    validationMessage = {
        username: {
            minlength: '用户名长度最少为2个字符',
            maxlength: '用户名长度最多为10个字符',
            required: '请填写用户名',
        },
        company_no: {
            required: '请填写工号',
            pattern: '不是工号格式',
        },
        password: {
            required: '请输入密码',
        },
        password_confirmation: {
            required: '请再次输入密码',
            atypism: '两次输入不一致',
            notPwd: '请先输入密码',
        },
    };

    // 构建表单方法
    buildForm(): void {
        // 通过 formBuilder构建表单
        this.registerForm = this.fb.group({
            /* 为 username 添加3项验证规则：
             * 1.必填， 2.最大长度为10， 3.最小长度为3， 4.不能以下划线开头， 5.只能包含数字、字母、下划线
             * 其中第一个空字符串参数为表单的默认值
             */
            username: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(2)]],
            company_no: ['', [Validators.required, Validators.pattern(/['X']['D'][0-9][0-9][0-9]/g)]],
            password: ['', [Validators.required]],
            password_confirmation: ['', [Validators.required]],
        });

        // 每次表单数据发生变化的时候更新错误信息
        this.registerForm.valueChanges.subscribe(data => {
            this.onValueChanged(data);
            // console.log(data);
            if (data.password_confirmation && !data.password) {
                this.formErrors['password_confirmation'] += this.validationMessage['password_confirmation']['notPwd'];
            }
            if (data.password_confirmation && data.password && data.password_confirmation !== data.password) {
                this.formErrors['password_confirmation'] += this.validationMessage['password_confirmation']['atypism'];
            }
        });

        // 初始化错误信息
        this.onValueChanged();
    }

    // 每次数据发生改变时触发此方法
    onValueChanged(data?: any) {
        // 如果表单不存在则返回
        if (!this.registerForm) return;
        // 获取当前的表单
        const form = this.registerForm;

        // 遍历错误消息对象
        for (const field in this.formErrors) {
            // 清空当前的错误消息
            this.formErrors[field] = '';
            // 获取当前表单的控件
            const control = form.get(field);

            // 当前表单存在此空间控件 && 此控件没有被修改 && 此控件验证不通过
            if (control && control.dirty && !control.valid) {
                // 获取验证不通过的控件名，为了获取更详细的不通过信息
                const messages = this.validationMessage[field];
                // 遍历当前控件的错误对象，获取到验证不通过的属性
                for (const key in control.errors) {
                    // 把所有验证不通过项的说明文字拼接成错误消息
                    this.formErrors[field] += messages[key] + '\n';
                }
            }
        }
    }

    constructor(
        private http: HttpClient,
        public baseData: BaseDataService,
        public Router: Router,
        private fb: FormBuilder,
        private el: ElementRef,
        public effectCtrl: PageEffectService,
        private menuPermission: MenuPermissionService,
    ) {}

    ngOnInit() {
        this.buildForm();
        let userInfo = sessionStorage.getItem('USERINFO');
        if (userInfo) {
            sessionStorage.removeItem('USERINFO');
            sessionStorage.removeItem('PERMISSION');
        }
    }

    ngAfterViewInit(): void {
        this.rememberPwdBug();
    }

    rememberPwdBug() {
        setTimeout(() => {
            let inputGroup = this.el.nativeElement.querySelectorAll('ion-input');
            inputGroup.forEach(element => {
                element.children[0].style = '';
            });
        }, 2000);
    }

    doLogin() {
        this.effectCtrl.showLoad({ spinner: null, duration: 0, message: '正在登陆……', translucent: false }).then(() => {
            let params = JSON.parse(JSON.stringify(this.loginInfo));
            delete params.name;
            delete params.password_confirmation;
            this.baseData.post({ url: '/login', params: params }, true).subscribe(data => {
                this.effectCtrl.loadCtrl.dismiss();
                //TODO  BUG
                let base: any = data;
                if (base.status == 0) {
                    this.effectCtrl.showAlert({
                        message: '登陆失败！',
                        header: '提示',
                        buttons: ['确定'],
                        subHeader: '',
                    });
                } else {
                    this.baseData.userInfo = base.data;
                    let fn = this.flatTreePermissions();
                    this.baseData.permissionList = JSON.parse(JSON.stringify(fn(base.permission)));
                    sessionStorage.setItem('USERINFO', JSON.stringify(this.baseData.userInfo));
                    sessionStorage.setItem('PERMISSION', JSON.stringify(this.baseData.permissionList));
                    fn = null;
                    this.baseData.permissionList.forEach(element => {
                        if (element.type === 'menu') this.menuPermission.permissions.push(element);
                    });
                    //判断是否是第一次登录
                    this.baseData.is_first = base.is_first;
                    //判断是否是验货人
                    this.baseData.is_Inspector = base.is_Inspector;
                    this.Router.navigate(['/home']);
                    this.baseData.setMenuChange(true);
                }
            });
        });
    }

    /**
     * 将Tree结构的数据扁平化
     */
    flatTreePermissions(): any {
        let value: Array<Permission> = [];
        return function flat(permissions: Array<Permission>) {
            permissions.forEach(permission => {
                value.push(permission);
                if (permission.children && permission.children.length) flat(permission.children);
            });
            return value;
        };
    }

    doRegistry() {
        this.effectCtrl.showLoad({ spinner: null, duration: 0, message: '正在注册……', translucent: false }).then(() => {
            let params = JSON.parse(JSON.stringify(this.loginInfo));
            delete params.password_confirmation;
            this.baseData.post({ url: '/register', params: params }, true).subscribe(data => {
                this.baseData.printDebug && console.log(data);
                this.effectCtrl.loadCtrl.dismiss();
                let base: any = data;
                if (base.status == 'fail') {
                    this.effectCtrl.showAlert({
                        message: '注册失败',
                        header: '提示',
                        buttons: ['确定'],
                        subHeader: '',
                    });
                } else {
                    this.effectCtrl.showAlert({
                        message: '注册成功',
                        header: '提示',
                        backdropDismiss: false,
                        buttons: [
                            {
                                text: '确定',
                                handler: () => {
                                    this.status = 'login';
                                },
                            },
                        ],
                    });
                }
            });
        });
    }

    tabStatus(status: string) {
        this.status = status;
    }

    ionViewCanLeave() {
        this.effectCtrl.clearEffectCtrl();
        console.log('ionViewCanLeave');
    }

    projectNameChanged(e) {
        let keycode = window.event ? e.keyCode : e.which;

        if (keycode == 13) {
            //回车键
            this.doLogin();
        }

        if (keycode == 27) {
        }
    }
}

export class loginInfo {
    constructor(
        public name: string,
        public company_no: string,
        public password: string,
        public password_confirmation: string,
    ) {}
}
