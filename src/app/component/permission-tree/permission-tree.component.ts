import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Permission } from 'src/app/services/permission.service';
import { PermissionType } from 'src/app/pages/permission/permission.component';

export interface ReportFiled {
    label: string;
    value: string;
    checked?: boolean;
}
@Component({
    selector: 'app-permission-tree',
    templateUrl: './permission-tree.component.html',
    styleUrls: ['./permission-tree.component.scss'],
})
export class PermissionTreeComponent implements OnInit {
    _permissions: Array<Permission> = [];
    permissionTypeMap: any = PermissionType;
    _permissionListFiled: Array<Permission> = [];
    permissionReport: Array<ReportFiled> = [];
    treePermission: Array<string> = [];
    @Input() nzCheckable: boolean;

    @Input() set permissionListFiled(input: Array<Permission>) {
        if (input && input.length) this._permissionListFiled = this.setListFieldData(input);
    }

    @Input() set permission(input: Array<Permission>) {
        if (input && input.length) this._permissions = input;
        if (!this.nzCheckable) {
            this._permissions = this.setReadonly(this._permissions);
        }
        let fn = this.getSelectedIdForTree();
        let selectedTreeIds: Array<string> = JSON.parse(JSON.stringify(fn(this._permissions)));
        fn = null;
        this.onChange.emit(selectedTreeIds); //将选中的id数组emit出去
    }

    @Output() onChange: EventEmitter<Array<string>> = new EventEmitter();
    constructor() {}

    ngOnInit() {
       
    }

    setReadonly(permissions: Permission[]) {
        permissions.forEach(permission => {
            if (permission.children && permission.children.length) {
                this.setReadonly(permission.children);
            } else (permission as any).disableCheckbox = true;
        });
        return permissions;
    }

    /**
     * 设置permission的value和label配合ng-zorro的nz-checkbox-group使用
     * @param permissions
     */
    setListFieldData(permissions: Permission[]): Permission[] {
        permissions.forEach(item => {
            item.children.forEach(child => {
                (child as any).label = (child as any).title;
                (child as any).value = child.key;
            });
        });
        return permissions;
    }

    logReportFiled(e: Permission) {
        this.onChange.emit(this.treePermission.concat(this.getCheckedId() as any)); //将选中的id数组emit出去
        console.log(e);
        // this.dataBind(e);
    }

    /**
     * 废弃
     * @param e
     */
    dataBind(e: Permission) {
        //将列表字段的key和菜单按钮保持一致
        //通过父级的id找到permission 从而匹配其字段子级
        this._permissions.forEach(permission => {
            if ((permission as any).id === (e as any).id) {
                //嵌套循环
                permission.children.forEach(child => {
                    e.children.forEach(item => {
                        let next = true;
                        if ((child as any).id === (item as any).id) {
                            (child as any).checked = (item as any).checked;
                        } else if (!(child as any).checked) {
                        }
                    });
                });
            }
        });

        this._permissions = [...this._permissions];
    }

    getTreePermission(e: Array<string>) {
        let selectedTreeId: Array<number> = [];
        this.treePermission = e;
        let fn = this.getSelectedIdForTree();
        selectedTreeId = JSON.parse(JSON.stringify(fn(this._permissions)));
        fn = null;
        this.onChange.emit((selectedTreeId as any).concat(this.getCheckedId()));
    }

    //遍历tree将为true的
    getSelectedIdForTree() {
        let value: Array<number> = [];
        return function map(permissions: Array<Permission>) {
            permissions.forEach(permission => {
                (permission as any).checked && value.push(permission.key as any);
                permission.children && permission.children.length && map(permission.children);
            });
            return value;
        };
    }

    /**
     * 将permissionListField和permissionReport checked为true的value取出来
     */
    getCheckedId(): Array<number> {
        let value: Array<number> = [],
            listFiled: Array<Permission> = this._permissionListFiled,
            reportFiled: Array<ReportFiled> = this.permissionReport;
        listFiled.forEach((item: Permission) => {
            item.children.forEach(sItem => {
                (sItem as any).checked && value.push((sItem as any).id);
            });
        });
        reportFiled.forEach((item: ReportFiled) => {
            item.checked && value.push(item.value as any);
        });
        return value;
    }
}
