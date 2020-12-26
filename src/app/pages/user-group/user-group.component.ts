import { Component, OnInit } from '@angular/core';
import { User } from '../create-user/create-user.page';
import { Permission, PermissionService } from 'src/app/services/permission.service';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { department, UserService, userOutData } from 'src/app/services/user.service';

export interface PowerGroup {
    id: number;
    name: string;
    users?: Array<User>;
    permissions?: Array<Permission>;
    description?: string;
}
@Component({
    selector: 'app-user-group',
    templateUrl: './user-group.component.html',
    styleUrls: ['./user-group.component.scss'],
})
export class UserGroupComponent implements OnInit {
    editIsVisible: boolean = false;
    drawerVisible: boolean = false;
    selectedUsers: Array<string> = [];
    currentUserGroup: PowerGroup = { id: null, name: null };
    permissionGroup: Array<PowerGroup> = [];
    departmentList: department[] = [];
    permissions: Array<Permission> = [];
    fieldPermission: Array<Permission> = [];
    editType: 'user' | 'info' = 'info';
    constructor(
        private permissionCtrl: PermissionService,
        private msg: NzMessageService,
        private globalRedo: GlobalRedoService,
        public userService: UserService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2024) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getGroups();
        this.getPermissions();
    }

    getDepartmentList() {
        this.selectedUsers = [];
        this.userService.getUserListByGroup(this.currentUserGroup.id).subscribe((data: department[]) => {
            this.departmentList = this.mapTree(data);

            let flattenData = this.flattenTree()(data);
            flattenData.forEach(element => {
                element.checked && this.selectedUsers.push(element.id);
            });
            console.log(this.selectedUsers);
        });
    }

    mapTree(tree: any[]): any[] {
        let value = [];
        tree.forEach(item => {
            item.key = item.id;
            item.title = item.name;
            value.push(item);
            if (item.children && item.children.length) {
                this.mapTree(item.children);
            }
        });
        return value;
    }

    flattenTree() {
        let value = [];
        return function flat(tree: any[]) {
            tree.forEach(element => {
                value.push(element);
                if (element.children && element.children.length) {
                    flat(element.children);
                }
            });
            return value;
        };
    }

    getGroups() {
        this.permissionCtrl.getPermissionGroups().subscribe(res => {
            this.permissionGroup = res.data;
            console.log(res.data);
        });
    }

    getPermissions() {
        this.permissionCtrl.getAllPermission().subscribe(res => {
            this.permissions = res.data;
        });
    }

    getPermissionByGroupId(p: PowerGroup) {
        this.currentUserGroup = p;
        this.permissionCtrl.getPermissionByGroupId(p.id as any).subscribe(res => {
            this.permissions = res.data.all_data;
            this.fieldPermission = res.data.field_data;
            console.log(res);
        });
    }

    editUserGroup(p?: PowerGroup) {
  
        this.currentUserGroup = p ? p : { id: null, name: null };
        p && this.getDepartmentList();
        this.editIsVisible = !this.editIsVisible;
    }
    addUserPermissionGroup;

    getItemForTree(id: number): any {
        let value: any = null;
        return function map(tree: any[]) {
            tree.forEach(element => {
                if (element.id === id) {
                    value = element;
                } else if (element.children && element.children.length) map(element.children);
            });
            return value;
        };
    }

    addHandleOk() {
        if (this.editType == 'info') {
            this.permissionCtrl[this.currentUserGroup.id ? 'updatePermissionGroup' : 'addPermissionGroups'](
                this.currentUserGroup,
            ).subscribe(res => {
                this.msg[res.status ? 'success' : 'error'](res.message);
                this.editIsVisible = !res.status;
                res.status && (this.currentUserGroup = { id: null, name: null });
                res.status && this.getGroups();
            });
        } else {
            let selected: department[] = [],
                value: string[] = [];
            //将tree结构的每个选中的取出
            this.selectedUsers.forEach(item => {
                let node = this.getItemForTree(item as any)(this.departmentList);
                //取出拍平的树结构的最后一级（user）
                if (node.type === 'user') {
                    selected.push(node);
                } else if (node.type === 'department') {
                    if (!node.children || !node.children.length) return;
                    node.children.forEach(position => {
                        if (!position.children || !position.children.length) return;
                        position.children.forEach(user => {
                            selected.push(user);
                        });
                    });
                } else if (node.type === 'position') {
                    if (!node.children || !node.children.length) return;
                    selected = selected.concat(node.children);
                }
            });

            selected.forEach(item => {
                value.push((item as any).id);
            });
            console.log(selected);

            this.permissionCtrl
                .addUserPermissionGroup({ group_id: this.currentUserGroup.id, user_id: value as any })
                .subscribe(res => {
                    this.msg[res.status ? 'success' : 'error'](res.message);
                    this.editIsVisible = !res.status;
                });
        }
    }

    delete(p: PowerGroup) {
        this.permissionCtrl.deletePermissionGroup(p)
            .subscribe(res =>{
                this.msg[res.status ? 'success' : 'error'](res.message);
                res.status && this.getGroups()
            })
    }

    onChangeUsers(e: any) {
        console.log(e);
    }

    permissionChange(e: any) {
        this.selectedPermissions = e;
    }

    selectedPermissions: Array<number> = [];

    submitPermission() {
        this.permissionCtrl
            .gavePermission({
                type: 'group',
                target_id: this.currentUserGroup.id,
                permission_id: this.selectedPermissions,
            })
            .subscribe(res => {
                this.msg[res.status ? 'success' : 'error'](res.message);
                console.log(res);
            });
    }
}
