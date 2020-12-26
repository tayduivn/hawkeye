import { Injectable } from '@angular/core';
import { Permission } from './permission.service';

@Injectable({
    providedIn: 'root',
})
export class MenuPermissionService {
    permissions: Array<Permission> = [];

    constructor() {}

    has(name: string, parentId?: number): boolean {
        return this.permissions.some(item => {
            if (parentId) {
                return name === item.name && parentId === item.parent_id;
            } else return name === item.name && !item.parent;
        });
    }
}
