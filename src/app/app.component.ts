import { UserLimitService } from './services/user-limit.service';
import { PageEffectService } from './services/page-effect.service';
import { BaseDataService } from './services/base-data.service';
import { Component, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { Permission } from './services/permission.service';
import { menuItem } from './share/menu.json';
import { ThemeService, Theme } from './layout/theme.service';
import { MenuPermissionService } from './services/menu-permission.service';
import { timer } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {
    theme: Theme;
    elem: ElementRef;
    public appPages: menuItem[] = this.baseData.appPages;
    public showMenu: boolean = true;
    public loading: boolean = false;
    currentParentItem: menuItem = {
        title: '',
        url: '',
        type: '',
        icon: '',
        active: null,
        limit: '',
    };
    currentSonItem: menuItem = {
        title: '',
        url: '',
        type: '',
        icon: '',
        active: null,
        limit: '',
    };
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        public baseData: BaseDataService,
        private Router: Router,
        public location: PlatformLocation,
        public userLimit: UserLimitService,
        public effectCtrl: PageEffectService,
        private themeService: ThemeService,
        public menuPermission: MenuPermissionService,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(res => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
    ngOnInit(): void {
        //路由改变的时候执行是否显示菜单的方法
        this.Router.events.subscribe(event => {
            this.showMenu = true;
            this.showMenuFn();
        });
        let userInfo: any = sessionStorage.getItem('USERINFO') || null;
        let permissionList: Permission[] = JSON.parse(sessionStorage.getItem('PERMISSION')) || null;
        if (userInfo && permissionList) {
            userInfo = JSON.parse(userInfo);
            this.baseData.userInfo = userInfo;
            this.baseData.permissionList = permissionList;
            permissionList.forEach(element => {
                if (element.type === 'menu') this.menuPermission.permissions.push(element);
            });
            this.menuShowFn(); //bug
        }

        // 订阅loading
        this.baseData.valueUpdated.subscribe((val: boolean) => {
            this.loading = val;
        });

        this.baseData.menuChanged.subscribe(val => {
            this.menuShowFn(); // bug
        });
        // 订阅自动展开菜单项
        this.baseData.autoExpandMenu.subscribe((menu: menuItem) => {
            this.appPages.forEach(value => {
                if ('dashboard' + value.url === menu.url) {
                    this.choice(value, menu.sonIndex);
                }
            });
        });

        this.themeService.theme.subscribe(res => {
            this.theme = res;
        });
    }

    // 判断菜单显示
    menuShowFn() {
        this.menuPermission.permissions.forEach(permission => {
            this.menuPermissionString += permission.name + '&';
        });
        let appPages: menuItem[] = JSON.parse(JSON.stringify(this.baseData.appPages));
        for (var i = 0; i < appPages.length; i++) {
            let menu: menuItem = appPages[i];
            if (menu.title != '主页' && menu.title != '退出') {
                if (menu.children && menu.children.length) {
                    let count = 0,
                        childLength = menu.children.length;
                    if (menu.children.length) menu.url = menu.children[0].url;
                    if (count == childLength) {
                        appPages.splice(i, 1);
                        i--;
                        count = 0;
                    }
                }
            }
        }
        this.appPages = this.filterMenu(appPages);
    }

    menuPermissionString: string = '';

    filterMenu(menus: any[]) {
        for (var i = 0; i < menus.length; i++) {
            if (menus[i].title === '主页' || menus[i].title === '退出') continue;
            if (this.menuPermissionString.indexOf(menus[i].limit) == -1) {
                menus.splice(i, 1);
                i--;
            }
            if (menus[i] && menus[i].children && menus[i].children.length) {
                this.filterMenu(menus[i].children);
            }
        }

        return menus;
    }

    showMenuFn() {
        for (var i = 0; i < this.baseData.notShowMenuPageArr.length; i++) {
            if (this.location.hash.match(this.baseData.notShowMenuPageArr[i]) != null) {
                this.showMenu = false;
                return;
            }
        }
    }

    menuBtn(p: any) {
        this.currentSonItem = p;
        let that = this;
        if (p.type == 'link') {
            this.Router.navigate([p.notModify ? p.url : '/dashboard/' + p.url]);
        }
        if (p.title == '退出') {
            this.effectCtrl.showAlert({
                message: '确定要退出吗？',
                header: '提示',
                buttons: [
                    {
                        text: '确定',
                        handler: () => {
                            sessionStorage.removeItem('USERINFO');
                            sessionStorage.removeItem('PERMISSION');
                            that.Router.navigate(['/login']);
                            timer(500).subscribe(() => {
                                location.reload();
                            });
                        },
                    },
                    {
                        text: '取消',
                    },
                ],
            });
        }
    }

    choice(item: any, sonIndex?: number) {
        //sonIndex 为 自动展开菜单时 第几个子菜单展开
        if (item.children) {
            item.active = !item.active;
            this.menuBtn(item.children[sonIndex ? sonIndex : 0]);
        }
        this.currentParentItem = item;
        this.appPages.map(menu => {
            menu.children && (menu.active = false);
            item.active = true;
        });
        this.baseData.printDebug && console.log(item);
    }
}
