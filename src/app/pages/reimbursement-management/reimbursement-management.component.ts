import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { reimbursement } from 'src/app/services/reimbursement.service';

@Component({
    selector: 'app-reimbursement-management',
    templateUrl: './reimbursement-management.component.html',
    styleUrls: ['./reimbursement-management.component.scss'],
})
export class ReimbursementManagementComponent implements OnInit {
    constructor(
        private router: Router,
        private message: NzMessageService,
        private travel: reimbursement,
        private es: PageEffectService,
        private globalRedo: GlobalRedoService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 2030) {
                this.queryInfo.page = 1;
                this.queryInfo.paginate = 10;
                this.ngOnInit();
            }
        });
    }
    isVisible: boolean = false; //控制弹出层显示
    isOkLoading: boolean = false; //控制按钮

    params: any = {
        approval_status: '', //审批报销的下拉选择器的双向绑定对象
        approval_remarks: '', //审批报销的备注的双向绑定对象
    };
    // 默认的查询参数
    queryInfo: any = {
        page: 1,
        paginate: 10,
    };
    searchQuery: any = {
        start_time: '',
        end_time: '',
        reimbursement_name: '',
    };
    showFactory: string = '';
    toolTip: string[] = [];
    toolTip1: string[] = [];
    total: any;
    ngOnInit() {
        this.getList(this.queryInfo);
    }
    date: any[] = [];
    // 获取列表
    getList(params: any) {
        this.toolTip1 = [];
        this.toolTip = [];
        this.travel.getList(params).subscribe(res => {
            // 获取失败的情况下
            if (res.status != 1)
                return this.es.showToast({
                    message: res.message,
                    color: 'danger',
                    duration: 1500,
                });
            // 获取成功解构出数据
            const {
                data: { travelReimbursement },
            } = res;
            this.total = res.data.travel_total;
            // 表格的数据源
            this.dataSet = travelReimbursement;
            this.dataSet.forEach(item => {
                let str = '';
                if (item.factory_name_and_serial.length >= 1) {
                    item.factory_name_and_serial.forEach((key, index) => {
                        str += `${key}\n`;
                    });
                    this.toolTip.push(str);
                } else {
                    this.toolTip.push('暂无');
                }
            });

            this.toolTip.forEach(item => {
                this.toolTip1.push(item.slice(0, item.length - 1));
            });
            console.table(this.toolTip1);
            console.log(this.dataSet);
        });
    }
    handleTime(time: string): string {
        const date = new Date(time);
        console.log(date);
        const y = date.getFullYear();
        let m: any = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d: any = date.getDate();
        d = d < 10 ? '0' + d : d;
        return `${y}-${m}-${d}`;
    }
    formatDate(date: any): string {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? '0' + d : d;
        let h = date.getHours();
        h = h < 10 ? '0' + h : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;
        let second = date.getSeconds();
        second = second < 10 ? '0' + second : second;
        return `${y}-${m}-${d} ${h}:${minute}:${second}`;
    }
    getSearch() {
        if (this.date.length == 0 && this.searchQuery.reimbursement_name == '')
            return this.message.create('error', '请输入查询条件!!!');
        // 合并查询参数进行查询
        // 查询的时候先把page置为一
        this.queryInfo.page = 1;
        // 处理时间
        this.onDateChange(this.date);
        // 先判断存在的字段
        let containerObj = {};
        for (let key in this.searchQuery) {
            if (this.searchQuery[key]) {
                containerObj[key] = this.searchQuery[key];
            }
        }
        Object.assign(containerObj, this.queryInfo);
        this.getList(containerObj);
    }
    reset() {
        this.date = [];
        this.searchQuery.reimbursement_name = '';
        this.queryInfo.page = 1;
        this.queryInfo.paginate = 10;
        this.getList(this.queryInfo);
    }
    onDateChange(e: any) {
        console.log(e);
        if (e.length) {
            const start_time = this.handleTime(this.formatDate(e[0]));
            const end_time = this.handleTime(this.formatDate(e[1]));
            this.searchQuery.start_time = start_time;
            this.searchQuery.end_time = end_time;
        } else {
            this.searchQuery.start_time = null;
            this.searchQuery.end_time = null;
        }
    }
    // 表格数据源;
    dataSet: any[] = [];
    goToDetails(id: any) {
        console.log('去详情');
        const queryParams = { id };
        this.router.navigate(['/dashboard/reimbursement-management-details'], { queryParams });
    }
    goToDownLoadReport() {
        console.log('去下载');
    }
    pageChanged() {
        console.log(this.queryInfo);
        this.getList(this.queryInfo);
    }
    pageSizeChanged() {
        console.log(this.queryInfo);
        this.getList(this.queryInfo);
    }
    approval_status_paramsArray: any[] = [];
    approval_status_paramsIndex: any[] = [];
    examine(id: any, number: any) {
        this.params = {
            approval_status: '', //审批报销的下拉选择器的双向绑定对象
            approval_remarks: '', //审批报销的备注的双向绑定对象
        };
        this.params.travel_id = id;
        this.params.travel_reimbursement_no = number;
        this.approval_status_paramsArray = [];
        this.approval_status_paramsIndex = [];
        console.log('弹出审批弹出层');
        this.isVisible = true;
        // 获取前置数据
        this.travel.getPreData().subscribe(res => {
            console.log(res.approval_status_params);
            for (let key in res.approval_status_params) {
                this.approval_status_paramsArray.push(res.approval_status_params[key]);
                this.approval_status_paramsIndex.push(key);
            }
            console.log(this.approval_status_paramsArray);
            console.log(this.approval_status_paramsIndex);
        });
    }
    handleCancel(): void {
        // 弹出层点击关闭
        this.isVisible = false;
    }
    handleOk(): void {
        // 弹出层点击确定 调用接口发起审批请求  审批完成后关闭弹出层 弹出审批成功提示框
        if (this.params.approval_status == '') return this.createMessage('error');
        console.log(this.params);
        this.isOkLoading = true;
        this.travel.postExamine(this.params).subscribe(res => {
            console.log(res);
            if (res.status != 1) {
                this.message.create('error', `${res.message}`);
                this.isOkLoading = false;
            } else {
                this.message.create('success', `${res.message}`);
                this.isOkLoading = false;
                this.isVisible = false;
                // 关闭后刷新主页面
                this.ngOnInit();
            }
        });
    }
    createMessage(type: string): void {
        this.message.create(type, '请选择审核状态后再确定!!!');
    }
    afterClose(): void {
        this.params.approval_status = '';
        this.params.approval_remarks = '';
    }
}
