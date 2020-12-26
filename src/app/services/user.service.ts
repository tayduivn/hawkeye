import { Observable } from 'rxjs';
import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { updateDepData } from '../pages/add-department/add-department.page';
import { Router } from '@angular/router';
import { User } from '../pages/create-user/create-user.page';
import { Permission } from './permission.service';
import { Response } from './inspection.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(public baseData: BaseDataService, private router: Router) {}
    // getUserList(): Observable<any> { //通过当前用户信息获取用户列表
    //   return this.baseData.get({ url: '/task/task-user' })
    // }

    getUserInfo(userId: number): Observable<any> {
        //通过用户id获取用户信息
        return this.baseData.get({ url: '/user/get-user', params: { id: userId } });
    }

    setRole(userId: number) {
        //通过用户id分配角色
    }

    addDepartmentOrPost(params: updateDepData): Observable<any> {
        return this.baseData.post({ url: '/role/add-role', params: params });
    }

    getDepartmentList(): Observable<userOutData> {
        return this.baseData.get({ url: '/roleNew/department-list' });
    }

    getPositionByDep(did: number | string): Observable<any> {
        return this.baseData.get({ url: '/rolenew/position-list', params: { id: did } });
    }

    deleteDepOrRole(did: number | string): Observable<any> {
        return this.baseData.delete({ url: '/role', params: did });
    }

    upDateDepRole(params: updateDepData): Observable<any> {
        return this.baseData.post({ url: '/role/update-role', params: params });
    }

    getDepById(did: number, showLoading?: true): Observable<any> {
        return this.baseData.get({ url: '/role/show-role', params: { id: did } }, showLoading);
    }

    editPermission(p: department, type: 'department' | 'position', list: 'dep' | 'post', utype: 'added' | 'modify') {
        this.router.navigate(['/add-department', type, p.id, list, utype]);
    }

    addUser(params: User): Observable<any> {
        //添加用户
        return this.baseData.post({ url: '/user/add-user', params: params });
    }

    getUserList(getUserListParams?: getUserListParams, showLoading?: true): Observable<any> {
        //用户列表
        for (var key in getUserListParams) {
            if (!getUserListParams[key]) {
                delete getUserListParams[key];
            }
        }
        return this.baseData.get({ url: '/user/user-list', params: getUserListParams }, showLoading);
    }

    updateUser(params: User): Observable<any> {
        return this.baseData.post({ url: '/user/update-user', params: params });
    }

    toggleStatus(params: { status: number; id: number }): Observable<any> {
        return this.baseData.post({ url: '/user/update-status', params: params });
    }

    getUserRolePermission(params: {
        user_id: number;
    }): Observable<Response<{ all_data: Permission[]; field_data: Permission[] }>> {
        return this.baseData.get({ url: '/permissionsNew/user_role_permission', params });
    }

    getRolePermissionById(role_id: number): Observable<Response<{ all_data: Permission[]; field_data: Permission[] }>> {
        return this.baseData.get({ url: '/permissionsNew/role_permission', params: { role_id } });
    }

    getUserListByGroup(group_id: number) {
        return this.baseData.get({ url: '/permissionsNew/user_list_by_group', params: { group_id } });
    }

    resetPwd(username: string) {
        return this.baseData.get({ url: '/user/forget_password', params: { username } });
    }

    togglePermissionRole(params: { is_has_role_permission: 0 | 1; user_id: number }) {
        return this.baseData.get({ url: '/user/is_has_role_permission', params });
    }
}

export interface userOutData {
    status: number;
    message: string;
    data: any;
    parent?: department;
}

export interface department {
    create_at?: string;
    description?: string;
    id?: number | string;
    name?: string;
    parent_id?: number;
    status?: number;
    type?: 0 | 1;
    children?: department[];
    title?: string;
    update_at?: string;
}

export interface getUserListParams {
    page?: number;
    user_name?: string;
    role_id?: number | string;
    department_id?: number | string;
}
