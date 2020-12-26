import { UserService, userOutData, department } from './../../services/user.service';
import { BaseDataService } from './../../services/base-data.service';
import { Component, OnInit } from '@angular/core';
import { UserLimitService } from 'src/app/services/user-limit.service';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { PermissionService, Permission } from 'src/app/services/permission.service';
import { TreeNodeInterface } from '../permission/permission.component';
import { updateDepData } from '../add-department/add-department.page';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-create-department',
    templateUrl: './create-department.page.html',
    styleUrls: ['./create-department.page.scss'],
})
export class CreateDepartmentPage implements OnInit {
    drawerVisible: boolean = false;
    editIsVisible: boolean = false;
    postIsVisible: boolean = false;
    doveIsVisible: boolean = false;
    editType: 'edit' | 'add' = null;
    permissions: Permission[] = [];
    fieldPermission: Permission[] = [];
    currentDepartment: department = {};
    currentPost: department = {};
    departmentList: department[] = [];
    target: department = {};
    canClick: boolean = true;
    addPostType: 0 | 1 = 0;
    parentId: number = null;
    constructor(
        public baseData: BaseDataService,
        public userService: UserService,
        public userLimit: UserLimitService,
        private globalRedo: GlobalRedoService,
        private permissionCtrl: PermissionService,
        private msg: NzMessageService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            if (!res) return;
            if (res.uid == 2021) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        this.getDepartmentList();
    }

    getPermissionByRole(p: department) {
        this.permissionCtrl.getPermissionGroups();
    }

    mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

    getDepartmentList() {
        this.userService.getDepartmentList().subscribe((data: userOutData) => {
            this.departmentList = data.data;
            this.departmentList.forEach(item => {
                this.mapOfExpandedData[(item as any).key] = this.convertTreeToList(item as any);
            });
        });
    }

    getPermissionByRoleId(p: department) {
        this.currentDepartment = p;
        this.permissionCtrl.getPermissionByRole(p.id as any).subscribe(res => {
            this.permissions = res.data.all_data;
            this.fieldPermission = res.data.field_data;
            console.log(res);
        });
    }

    delPermission(p: department) {
        this.userService.deleteDepOrRole(p.id).subscribe(data => {
            this.msg[data.status ? 'success' : 'error'](data.message);
            data.status && this.getDepartmentList();
        });
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

    collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
        if (!$event) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key)!;
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            }
            return;
        }
    }

    edit(item: department) {
        this.addPostType = item.type;
        if (this.addPostType) {
            this.currentPost = item;
        } else this.currentDepartment = item;
    }

    visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }

    toDetail() {}

    addHandleOk(type: 'dove'|'post') {
        let params: updateDepData = {
            type: this.currentPost.type ? this.currentPost.type : this.currentDepartment.type,
            name: this.currentPost.name ? this.currentPost.name : this.currentDepartment.name,
            description: this.currentPost.description ? this.currentPost.description : this.currentDepartment.description,
            parent_id: this.currentPost.name ? this.currentPost.parent_id : 0,
            id: this.currentPost.id ? this.currentPost.id : this.currentDepartment.id,
        };

        if(!params.type && !params.parent_id && this.parentId){
            params.type = 1;
            params.parent_id = this.parentId;
        }
        debugger
        // if (!this.currentDepartment.name||!this.currentPost.name) {
        //     this.msg.error('请填写必填项！');
        //     return;
        // }
        
       
        this.editType !== 'edit' && delete params.id;

        this.userService[this.editType == 'edit' ? 'upDateDepRole' : 'addDepartmentOrPost'](params).subscribe(res => {
            this.msg[res.status ? 'success' : 'error'](res.message);
            if (res.status) {
                this.currentDepartment = {};
                this.currentPost = {};
                this.canClick = true;
                this.getDepartmentList();
                this.doveIsVisible = this.postIsVisible = false;
            }
        });
    }

    permissionChange(e: any) {
        this.selectedPermissions = e;
    }

    selectedPermissions: Array<number> = [];

    submitPermission() {
        this.permissionCtrl
            .gavePermission({
                target_id: this.currentDepartment.id as any,
                type: 'role',
                permission_id: this.selectedPermissions,
            })
            .subscribe(res => {
                this.msg[res.status ? 'success' : 'error'](res.message);
                console.log(res);
            });
    }

    editContent(item: department){
        debugger
        this.canClick = false
        this.editType = 'edit';
        if(item.type === 0){
            this.doveIsVisible = !this.doveIsVisible;  
            this.currentDepartment = JSON.parse(JSON.stringify(item));
            this.currentPost = {};
        }else{
            this.postIsVisible = !this.postIsVisible;
            this.currentPost = JSON.parse(JSON.stringify(item));
            this.currentDepartment = {};
        }
    }
}
