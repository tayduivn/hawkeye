import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalRedoService } from 'src/app/services/global-redo.service';
import { FactoryListQueryInfo, InspectingService } from 'src/app/services/inspecting.service';
import { PageEffectService } from 'src/app/services/page-effect.service';
import { environment } from '../../../environments/environment';
import { FlashService } from '../inspect-record-details/flash.service';
@Component({
    selector: 'app-factory-list',
    templateUrl: './factory-list.component.html',
    styleUrls: ['./factory-list.component.scss'],
})
export class FactoryListComponent implements OnInit {
    obs$: any;
    constructor(
        private inspecting: InspectingService,
        private es: PageEffectService,
        private router: Router,
        private globalRedo: GlobalRedoService,
        private flash: FlashService,
    ) {
        this.globalRedo.refresh.subscribe(res => {
            // res && console.log(location.href.indexOf(res.path));
            if (!res) return;
            if (res.uid == 2025) {
                this.ngOnInit();
            }
        });
    }
    ngOnInit() {
        this.flash.flash$.subscribe(res => {
            if (res == 'flash') {
                // this.queryInfo.page = 1;
                // debugger;
                this.getList(this.queryInfo);
            }
        });
        this.queryInfo.page = 1;
        this.getList(this.queryInfo);
    }
    // 获取列表的函数
    getList(params: FactoryListQueryInfo): void {
        this.inspecting.getInspectFactoryList(params).subscribe(res => {
            console.log(res);
            // 判断是否获取成功
            if (res.status != 1)
                return this.es.showToast({
                    message: '获取列表失败',
                    color: 'danger',
                });
            // 解构出数据
            const { data } = res;
            // 工厂列表
            this.listOfData = data.factory;
            console.log(this.listOfData);
            console.log(data);

            // // 考察人员的id数组  id数组和人员数组一一对应
            this.userInfo = data.user;
            // 数据的总数
            this.total = data.factory_total;
        });
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
    userInfo: any[] = [];
    // 查询参数对象
    queryInfo: any = {
        page: 1, //请求页面的页码
        paginate: 10, //请求每一页的页数
    };
    // 這個参数对象只在搜索的时候会拷贝给queryInfo  其余的时候只传queryInfo
    searchQuery: any = {
        name: null, //考察对象
        start_time: null, //开始时间
        end_time: null, //结束时间
        user_id: null, //用户编号()
    };
    handleTime(time: string): string {
        const date = new Date(time);
        console.log(date);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${y}-${m}-${d}`;
    }
    // 列表总数
    total: number;
    onClickOkCallback() {}
    // 日期发生改变的时候触发  这里可以拿到两个的时间（开始时间  结束时间）
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
    date: any[] = [];
    // 表格的数据源  分页的数据需要渲染的数据也是赋值给他  进行渲染
    listOfData: any[] = [];
    // 当前的页码
    currentPage: number = 0;
    flagSearch: boolean;
    // 点击查询
    getSearch() {
        // 查询的时候先把page置为一
        this.queryInfo.page = 1;
        // 处理时间
        this.onDateChange(this.date);
        let flag = false;
        // 判断是否有查询条件 没有的话弹出
        for (let key in this.searchQuery) {
            console.log(this.searchQuery[key]);

            if (this.searchQuery[key]) {
                // 只要有查询条件就查询
                flag = true;
            }
        }
        if (!flag)
            // 没有查询条件的情况 return 出去
            return this.es.showToast({
                message: '请输入查询条件',
                color: 'danger',
            });

        // 先判断存在的字段
        let containerObj = {};
        for (let key in this.searchQuery) {
            if (this.searchQuery[key]) {
                containerObj[key] = this.searchQuery[key];
            }
        }
        Object.assign(containerObj, this.queryInfo);
        this.getList(containerObj);
        console.log(containerObj);
    }
    // 点击重置按钮
    reset(): void {
        // 重置的时候重置对象
        for (let key in this.searchQuery) {
            this.searchQuery[key] = null;
        }
        // 还要清空时间栏
        this.date = [];
        this.queryInfo.page = 1;
        this.queryInfo.paginate = 10;
        this.getList(this.queryInfo);
    }
    // 页码发生改变的时候
    pageChanged(): void {
        this.getList(this.queryInfo);
        console.log(this.queryInfo);
    }
    // 每页的数量发生改变的时候
    pageSizeChanged(): void {
        this.getList(this.queryInfo);
        console.log(this.queryInfo);
    }
    // 预览报告
    goToPreviewReport(factory_id: any) {
        window.open(environment.apiUrl + `/factory/factory_inspect_preview?factory_id=${factory_id}&type=preview`);
    }
    // 下载报告
    goToDownLoadReport(factory_id: any) {
        window.open(environment.apiUrl + `/factory/down_pdf?factory_id=${factory_id}&type=down_pdf`);
    }
    goToDetails(id: any) {
        console.log(id);
        const queryParams = { id };
        this.router.navigate(['/dashboard/inspect-record-details'], { queryParams });
    }
    // 点击下载视频
    goToDownLoadVideo(id: string) {
        window.open(environment.apiUrl + '/factory/down_factory_inspect_video?apply_inspection_no=' + id);
    }

    goToDownLoadimage(id: string) {
        window.open(environment.apiUrl + '/factory/down_factory_inspect_image?apply_inspection_no=' + id);
    }
    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // this.obs$.unsubscribe();
    }
}
