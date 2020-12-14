import { WebsocketService } from './../../services/websocket.service';
import { GlobalRedoService } from './../../services/global-redo.service';
import { themes, Theme, ThemeService } from './../theme.service';
import { BaseDataService } from 'src/app/services/base-data.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { eachA, pushUniqueA, indexA, removeA } from 'src/app/utils';
import { menuItem } from 'src/app/share/menu.json';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.page.html',
    styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
    tabs: any[] = [];
    themes: Theme[] = themes;
    theme: Theme;
    examine: any = {
        msg: '',
        url: ''
    };
    date: Observable<Date> = new Observable((observer) => {
        setInterval(() => {
            const date = new Date();
            observer.next(date);
        }, 1000);
    });
    menus: any = [
        { path: 'dashboard/order-track', title: '订单跟踪', uid: 201, sonIndex: 0, parent: 'dashboard/order-track' },
        { path: 'dashboard/track-detail', title: '跟踪进度', uid: 2012, parent: 'dashboard/order-track' },
        { path: 'dashboard/order/history', title: '历史记录列表', uid: 203, parent: 'dashboard/order-track' },
        {
            path: 'dashboard/get-contract',
            title: '获取合同接口',
            uid: 202,
            sonIndex: 2,
            parent: 'dashboard/order-track',
        },
        {
            path: 'dashboard/apply-inspection',
            title: '申请列表',
            uid: 204,
            sonIndex: 0,
            parent: 'dashboard/apply-list',
        },
        {
            path: 'dashboard/inspection-list',
            title: '验货列表',
            uid: 205,
            sonIndex: 1,
            parent: 'dashboard/apply-list',
        },

        {
            path: 'dashboard/order-grouping',
            title: '创建批次列表',
            uid: 206,
            sonIndex: 0,
            parent: 'dashboard/order-grouping',
        },
        {
            path: 'dashboard/distributed-group-list',
            title: '已创建批次列表',
            uid: 207,
            sonIndex: 1,
            parent: 'dashboard/order-grouping',
        },
        {
            path: 'dashboard/distribute-inspection',
            title: '分配验货',
            uid: 208,
            sonIndex: 2,
            parent: 'dashboard/order-grouping',
        },
        {
            path: 'dashboard/distrib-to-user',
            title: '分配验货',
            uid: 2081,
            parent: 'dashboard/order-grouping',
        },
        {
            path: 'dashboard/select-distributed-list',
            title: '待审核任务',
            uid: 209,
            sonIndex: 3,
            parent: 'dashboard/order-grouping',
        },
        {
            path: 'dashboard/confirmed-task-list',
            title: '已确认任务列表',
            uid: 2010,
            sonIndex: 4,
            parent: 'dashboard/order-grouping',
        },
        {
            path: 'dashboard/data-compare',
            title: '数据对比',
            uid: 20141,
            sonIndex: 5,
            parent: 'dashboard/data-compare',
        },
        {
            path: 'dashboard/data-compare-detail',
            title: '对比详情',
            uid: 20142,
            parent: 'dashboard/data-compare',
        },
        {
            path: 'dashboard/data-compare-examine/:ano',
            title: '审核',
            uid: 20143,
            parent: 'dashboard/data-compare',
        },
        {
            path: 'dashboard/data-compare',
            title: '数据对比',
            uid: 2014,
            sonIndex: 0,
            parent: 'dashboard/data-compare',
        },

        {
            path: 'dashboard/stay-arraying-list',
            title: '待排柜列表',
            uid: 2015,
            sonIndex: 0,
            parent: 'dashboard/stay-arraying-list',
        },
        {
            path: 'dashboard/arraying-container',
            title: '已排柜列表',
            uid: 2016,
            sonIndex: 1,
            parent: 'dashboard/stay-arraying-list',
        },
        {
            path: 'dashboard/installed-cabinets',
            title: '待装柜列表',
            uid: 2017,
            sonIndex: 2,
            parent: 'dashboard/stay-arraying-list',
        },
        {
            path: 'dashboard/final-cabinets',
            title: '最终列表',
            uid: 2018,
            sonIndex: 3,
            parent: 'dashboard/stay-arraying-list',
        },
        {
            path: 'dashboard/permission',
            title: '权限列表',
            uid: 2019,
            sonIndex: 0,
            parent: 'dashboard/permission',
        },
        // {
        //     path: 'dashboard/role',
        //     title: '角色管理',
        //     uid: 2020,
        //     sonIndex: 1,
        //     parent: 'dashboard/permission',
        // },
        {
            path: 'dashboard/develope-list',
            title: '部门列表',
            uid: 2021,
            sonIndex: 2,
            parent: 'dashboard/develope-list',
        },
        {
            path: 'dashboard/user-list',
            title: '用户列表',
            uid: 2022,
            sonIndex: 1,
            parent: 'dashboard/develope-list',
        },
        {
            path: 'dashboard/modify-pwd',
            title: '修改密码',
            uid: 2023,
            sonIndex: 2,
            parent: 'dashboard/develope-list',
        },
        {
            path: 'dashboard/user-group',
            title: '用户组',
            uid: 2024,
            sonIndex: 1,
            parent: 'dashboard/permission',
        },
    ];
    // uid映射
    // 用于快速查找, 而不用每次都去 forEach(menus)
    menusMap: { [uid: string]: any } = {};
    selectedIndex: any;
    @ViewChild('tmp', { static: false }) template?: TemplateRef<{}>;
    // ...
    constructor(
        // 路由器控制器
        private router: Router,
        // 页面标题服务
        private titleService: Title,
        // 当前组件相关的路由器
        public baseData: BaseDataService,
        private themeService: ThemeService,
        private globalRedo: GlobalRedoService,
        private notificationService: NzNotificationService,
        private websocket: WebsocketService
    ) {
        // 监听路由事件
        // 只订阅 ActivationEnd 事件
        this.router.events.pipe(filter((e) => e instanceof ActivationEnd)).subscribe((e: ActivationEnd) => {
            const snapshot = e.snapshot;
            const isSkip = !(
                snapshot['_routerState'].url &&
                snapshot.routeConfig.data &&
                snapshot.routeConfig.data.useCache
            );
            if (isSkip) return;
            // 获取路由配置中自定义的唯一标记
            // uid: Unique Identity
            const uid = snapshot.routeConfig.data.uid;

            // 从当前激活的已存在的 tab 缓存中直接激活
            let exist = false;
            eachA(this.tabs, (tab, i) => {
                if (uid === tab.uid) {
                    // mvvm 模式直接激活指定 tab
                    this.selectedIndex = i;
                    exist = true;
                    return false;
                }
            });
            // 指定路由没有在 tab 缓存中找到(或已经从ui中关闭/删除)
            // 首次进入没找到 tab, 从menu中获取
            if (!exist) this.actionTab(this.menusMap[uid]);
        });

    }

    ngOnInit() {
        this.initMenusMap(this.menus);
        this.themeService.theme.subscribe((res) => {
            this.theme = res;
        });
    }

    // 初始化uid菜单映射
    initMenusMap(ms: Array<any>) {
        if (Array.isArray(ms))
            eachA(ms, (m) => {
                this.menusMap[m.uid] = m;
                // 递归子孙菜单
                this.initMenusMap(m.child);
            });
    }

    // 点击菜单激活指定路由并保存tab页签
    // 这里命名不准确, 应修改为 actionMenu
    actionTab(menu) {
        if (!menu) return;

        // 如果已经存在该tab页签, 直接将它选中
        // 如果没有打开就添加该tab页签, 并将它选中
        // pushUniqueA 为自定义方法, 后面有说明
        this.selectedIndex = pushUniqueA(
            this.tabs,
            { name: menu.title, path: menu.path, uid: menu.uid, sonIndex: menu.sonIndex, parent: menu.parent },
            'uid',
        );

        // 将当前页面标题切换为菜单名字
        let tab = this.tabs[this.selectedIndex];

        this.titleService.setTitle(tab.name);

        // 激活这个tab对应的路由视图
        this.activeRoute(tab);
    }

    // 关闭tab页签
    closeTab(tab) {
        // 最后一个不允许关闭
        if (1 === this.tabs.length) return;

        // 删除tab
        let optionIndex = indexA(this.tabs, tab, 'uid');
        removeA(this.tabs, tab, 'uid');

        // 正在关闭激活tab
        if (this.selectedIndex === optionIndex) {
            // 激活上一个tab
            let nextIndex = this.selectedIndex - 1;
            this.selectedIndex = nextIndex > 0 ? nextIndex : 0;
            // 激活上一个路由
            this.activeRoute(this.tabs[nextIndex]);
        }
        // 正在关闭激活tab的左侧tab
        else if (this.selectedIndex > optionIndex) {
            // 关闭前面的tab, 索引下标前移一位
            this.selectedIndex -= 1;
        }
        // 正在关闭激活tab的右侧tab
        else {
            // 关闭后面的tab, 不作任何处理
        }
    }

    // 切换tab选项卡
    tabSelect(tab) {
        // 激活选项卡对应的路由
        this.activeRoute(tab);
        let menuItem: menuItem = {
            url: tab.parent,
            sonIndex: tab.sonIndex,
        };
        this.baseData.setMenuExpand(menuItem);
    }

    // 激活tab所关联的路由
    activeRoute(tab) {
        // this.router.navigateByUrl(tab.path).finally();
        this.router.navigate([tab.path]);
        this.titleService.setTitle(tab.name);
    }

    changeTheme(p: Theme) {
        this.themeService.theme.next(p);
    }

    redo(tab: any) {
        this.globalRedo.redo(tab);
    }
}
