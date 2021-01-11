import { Component, OnInit } from '@angular/core';
import { PermissionService, Permission } from 'src/app/services/permission.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseDataService } from 'src/app/services/base-data.service';
import { GlobalRedoService } from 'src/app/services/global-redo.service';

export interface TreeNodeInterface {
    key: string;
    name: string;
    age?: number;
    level?: number;
    expand?: boolean;
    address?: string;
    children?: TreeNodeInterface[];
    parent?: TreeNodeInterface;
}

export enum PermissionType {
    menu = '菜单',
    btn = '按钮',
    field = '列表字段',
    'inspect-report' = '验货报告',
}

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent implements OnInit {
    permission: Array<Permission> = [];
    editIsVisible: boolean = false;
    value?: string;
    currentPermission: Permission = { key: null, name: '', type: null };
    permissionTypeMap: any = PermissionType;
    constructor(
        private permissionCtrl: PermissionService,
        public baseData: BaseDataService,
        public route: Router,
        public activeRoute: ActivatedRoute,
        public msg: NzMessageService,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2019) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getPermissionList();
    }

    getPermissionList() {
        this.permissionCtrl.getAllPermission().subscribe(res => {
            res.data.forEach(item => {
                (item as any).expand = true;
                this.mapOfExpandedData[(item as any).key] = this.convertTreeToList(item as any);
            });
            this.permission = res.data;
            console.log(this.permission);
            console.log(this.mapOfExpandedData);
        });
    }

    treeClick(e: any) {
        console.log(e);
    }

    editPermission(p?: Permission) {
        this.editIsVisible = !this.editIsVisible;
        this.currentPermission = p ? p : { key: null, type: null, name: '' };
    }

    delPermission(p: Permission) {
        this.permissionCtrl.removePermission(p.key).subscribe(res => {
            this.msg[res.status ? 'success' : 'error'](res.message);
            if (res.status) this.getPermissionList();
        });
    }

    treeHandleOk() {
        console.log(this.currentPermission);
        //如果key有值则是修改权限，反之
        this.permissionCtrl[this.currentPermission.key ? 'updatePermission' : 'addPermission'](
            this.currentPermission,
        ).subscribe(res => {
            console.log(res);
            this.msg[res.status ? 'success' : 'error'](res.message);
            if (res.status) {
                this.getPermissionList();
                this.editIsVisible = !this.editIsVisible;
            }
        });
    }

    onChange($event: string): void {
        console.log($event);
    }

    mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

    collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
        if (!$event) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key)!;
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
        const stack: any[] = [];
        const array: any[] = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop()!;
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
                }
            }
        }

        return array;
    }
}
