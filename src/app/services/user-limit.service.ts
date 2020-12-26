import { BaseDataService } from './base-data.service';
import { Permission } from './permission.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserLimitService {
    permissionList: Array<Permission> = [];
    constructor(private baseData: BaseDataService) {}

    has(permission: string, parentId?: number): boolean {
        permission = this.filterQueryString(permission);
        this.permissionList = this.baseData.permissionList;
        let some: boolean = this.permissionList.some((Permission: Permission) => {
            !Permission.name && (Permission.name = '');
            if (!parentId) {
                return Permission.name === permission && (Permission as any).checked;
            } else {
                return (
                    Permission.name === permission &&
                    Permission.parent_id === parentId &&
                    (Permission as any).checked
                );
            }
        });
        return some;
    }

    filterQueryString(str: string): string {
        let some: string = str;
        if (str.indexOf('?') != -1) {
            some = str.substring(0, str.indexOf('?'));
        }
        return some;
    }

    hasField() {
        //把所有的父级权限拼接 判断
    }
}