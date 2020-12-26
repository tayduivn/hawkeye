import { BaseDataService } from './base-data.service';
import { Injectable } from '@angular/core';
import { Response } from './inspection.service';
import { Observable } from 'rxjs';
import { PowerGroup } from '../pages/user-group/user-group.component';
import { ReportFiled } from '../component/permission-tree/permission-tree.component';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    getPermissionType(): Observable<Response<Array<string>>> {
        return this.baseData.get({ url: '/permission/get_permission_type' });
    }

    getAllPermission(): Observable<Response<Array<Permission>>> {
        return this.baseData.get({ url: '/permission/get_tree_permission_list' });
    }

    addPermission(params: Permission): Observable<Response<any>> {
        return this.baseData.post({ url: '/permission/add_permission', params });
    }

    removePermission(id: number): Observable<Response<any>> {
        return this.baseData.get({ url: '/permission/del_permission', params: { id } });
    }

    updatePermission(params: Permission): Observable<Response<any>> {
        return this.baseData.post({ url: '/permission/update_permission', params });
    }

    addPermissionGroups(params: PowerGroup): Observable<Response<any>> {
        return this.baseData.post({ url: '/permission/add_permission_groups', params });
    }

    getPermissionGroups(): Observable<Response<PowerGroup[]>> {
        return this.baseData.get({ url: '/permission/get_permission_groups' });
    }

    /**
     * 根据roleId获取权限
     */
    getPermissionByRole(role_id: number): Observable<Response<{ all_data: Permission[]; field_data: Permission[] }>> {
        return this.baseData.get({ url: '/permissionsNew/role_permission', params: { role_id } });
    }

    /**
     * 根据组id获取权限
     */
    getPermissionByGroupId(
        group_id: number,
    ): Observable<Response<{ all_data: Permission[]; field_data: Permission[] }>> {
        return this.baseData.get({ url: '/permissionsNew/get_group_permission', params: { group_id } });
    }

    deletePermissionGroup({ id }: PowerGroup): Observable<Response<any>> {
        return this.baseData.post({ url: '/permission/del_permission_group', params: { group_id: id } });
    }

    updatePermissionGroup(params: PowerGroup): Observable<Response<any>> {
        return this.baseData.post({ url: '/permission/update_permission_groups', params });
    }

    gavePermission(params: { target_id: number; type: 'user' | 'role' | 'group'; permission_id: Array<number> }) {
        return this.baseData.post({ url: '/permissionsNew/gave_permission', params });
    }

    /**
     * 给用户组分配用户
     */
    addUserPermissionGroup(params: { group_id: number; user_id: Array<number> }) {
        return this.baseData.post({ url: '/permissionsNew/add_user_permission_group', params });
    }

    constructor(public baseData: BaseDataService) {}
}

export interface permissionCache {
    type: string;
    item: Permission;
}

export interface getPermissionListParams {
    type: string;
    role_id?: number;
    user_id?: number;
}

export interface Permission {
    name: string; //英文名
    key: number; //唯一标识
    parent_id?: Number; //父级权限ID
    display_name?: string; //显示名称
    type: 'menu' | 'btn' | 'field' | 'inspect-report'; //权限类型
    order_no?: number; //在父级的children里的序号
    children?: Array<Permission>; //子权限
    created_at?: string; //创建时间
    updated_at?: string; //更新时间
    parent?: Permission;
}
