import { UserService, getUserListParams, department } from './../../services/user.service';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Permission, PermissionService } from 'src/app/services/permission.service';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { Observable } from 'rxjs';

export interface User {
    company_no?: string; //工号
    created_at?: string; //创建时间
    email?: string; //邮箱
    id: number; //标识
    level?: number; //级别
    mac?: string; //mac地址
    name: string; //名字
    status?: number; //是否启用状态
    telephone?: string; //电话
    updated_at?: string; //更新时间
    permissions?: Array<string>;
    department?: string; //部门
    post?: string; //岗位
    group?: Array<string>; //组
    role_id?: number; //岗位ID
}
@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.page.html',
    styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage implements OnInit {
    total = 1;
    pageSize = 20;
    pageIndex = 1;
    keywords: FormControl = new FormControl('');
    loading: boolean = false;
    userList: Array<any> = [];
    editIsVisible: boolean = false;
    drawerVisible: boolean = false;
    permissions: Array<Permission> = [];
    drawerType: 'readonly' | 'operation' = 'operation';
    fieldPermission: Permission[] = [];
    departmentList: department[] = [];
    positionList: department[] = [];
    currentPosition: number = null;
    currentDepartment: number = null;

    currentUser: User = {
        id: null,
        name: null,
    };
    getListParams: getUserListParams = {
        user_name: '',
        page: 1,
        role_id: null,
        department_id: null,
    };
    constructor(
        private userService: UserService,
        public baseData: BaseDataService,
        private globalRedo: GlobalRedoService,
        private msg: NzMessageService,
        public userLimit: UserLimitService,
        private permissionCtrl: PermissionService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2022) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getUserList();
        this.keywords.valueChanges.pipe(debounceTime(1000)).subscribe(res => {
            this.getListParams.user_name = res;
            this.getUserList();
        });
        this.getPermissions();
        this.getDepartmentList();
    }

    getDepartmentList() {
        this.userService.getDepartmentList().subscribe(res => {
            this.departmentList = res.data;
        });
    }

    getPositionByDid(e: number): Observable<boolean> {
        return new Observable(observer => {
            this.currentPosition = null;
            this.userService.getPositionByDep(e).subscribe(res => {
                this.positionList = res.data;
                observer.next(true);
            });
        });
    }

    getPermissions() {
        this.permissionCtrl.getAllPermission().subscribe(res => {
            this.permissions = res.data;
        });
    }

    getDepById(did: number) {
        this.userService.getDepById(did, true).subscribe(value => {
            this.getListParams.department_id = value.data.parent_id;
            setTimeout(() => {
                this.getListParams.role_id = value.data.id;
            }, 1500);
        });
    }

    permissionChange(e: any) {
        console.log(e);
        this.selectedPermissions = e;
    }

    selectedPermissions: Array<number> = [];

    submitPermission() {
        this.permissionCtrl
            .gavePermission({
                target_id: this.currentUser.id,
                type: 'user',
                permission_id: this.selectedPermissions,
            })
            .subscribe(res => {
                this.msg[res.status ? 'success' : 'error'](res.message);
                console.log(res);
            });
    }

    ionViewDidEnter() {
        !this.getListParams.role_id && this.getUserList();
    }

    ionViewDidLeave() {
        delete this.getListParams.role_id;
    }

    getUserList(pageNum?: number, showLoading?: true) {
        this.getListParams.page = pageNum ? pageNum : 1;
        this.userService.getUserList(this.getListParams, showLoading).subscribe((data: any) => {
            this.getListParams.page = data.data.current_page;
            this.userList = data.data.data;
            this.pageSize = data.data.per_page;
            this.total = data.data.total;
            this.pageIndex = data.data.current_page;
        });
    }

    toggleStatus(p: any) {
        console.log(p.status);
        this.userService.toggleStatus({ status: Number(p.status), id: p.id }).subscribe((data: any) => {
            this.msg[data.status ? 'success' : 'error'](data.message);
        });
    }

    editUser(p?: User) {
        this.editIsVisible = !this.editIsVisible;
        this.currentUser = p ? p : { id: null, name: null };
        this.currentDepartment =
            (this.currentUser as any).parent_role && (this.currentUser as any).parent_role.length
                ? (this.currentUser as any).parent_role[0].id
                : null;
        this.currentDepartment &&
            this.getPositionByDid(this.currentDepartment).subscribe(res => {
                this.currentPosition = (this.currentUser as any).role ? (this.currentUser as any).role[0].id : null;
            });
    }

    addHandleOk() {
        if (
            !this.currentUser.name ||
            !this.currentUser.email ||
            !this.currentUser.company_no ||
            !this.currentUser.mac ||
            !this.currentUser.telephone ||
            !this.currentDepartment ||
            !this.currentPosition
        ) {
            this.msg.error('请填写必填项！');
            return;
        }
        this.currentUser.role_id = this.currentPosition;
        this.userService[this.currentUser.id ? 'updateUser' : 'addUser'](this.currentUser).subscribe(res => {
            this.msg[res.status ? 'success' : 'error'](res.message);
            res.status && this.getUserList();
            this.editIsVisible = !res.status;
            if (res.status && !this.currentUser.id) {
                this.currentUser = {
                    name: '',
                    id: null,
                };
                this.currentDepartment = this.currentPosition = null;
            }
        });
    }

    onPageChange(e: any) {
        console.log(e);
    }

    resetPwd(p: User) {
        this.userService.resetPwd(p.company_no).subscribe(res => {
            this.msg[res.status ? 'success' : 'error'](res.message);
        });
    }

    showPostPermission(p: User) {
        this.userService.getRolePermissionById((p as any).role[0].id).subscribe(res => {
            this.permissions = res.data.all_data;
            this.fieldPermission = res.data.field_data;
        });
    }

    addPermissionToUser(p: User) {
        this.userService.getUserRolePermission({ user_id: p.id }).subscribe(res => {
            this.permissions = res.data.all_data;
            this.fieldPermission = res.data.field_data;
            console.log(res.data.field_data);
            // this.permissions[0].selected = true
        });
    }

    togglePermissionStatus(p: any) {
        this.userService
            .togglePermissionRole({ is_has_role_permission: p.is_need_role_permission ? 1 : 0, user_id: p.id })
            .subscribe(res => {
                console.log(res);
            });
    }

    companyTest: RegExp = /['X']['D'][0-9][0-9][0-9]/;
    get isDisabled() {
        return !/['X']['D'][0-9][0-9][0-9]/.test(this.currentUser.company_no);
    }
}
