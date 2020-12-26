import { Router } from '@angular/router';
import { BaseDataService } from '../../services/base-data.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { menuItem } from 'src/app/share/menu.json';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    date: Observable<Date> = new Observable((observer) => {
        setInterval(() => {
            const date = new Date();
            observer.next(date);
        }, 1000);
    });
    progress: number = 100;
    src: string;
    constructor(
        public baseData: BaseDataService,
        private menu: MenuController,
        private cd: ChangeDetectorRef,
        private Router: Router,
    ) {}

    ngOnInit(): void {
        let $this = this;
        this.setDiffimgSize();
        window.addEventListener(
            'orientationchange',
            function (event: any) {
                $this.setDiffimgSize();
            },
            false,
        );

        this.menu.close();

        if (this.baseData.is_first) {
            let menuItem: menuItem = {
                url: '/create-department',
                sonIndex: 2,
            };
            this.baseData.setMenuExpand(menuItem);
            this.Router.navigate(['/modify-pwd']);
        }
    }

    ionViewDidEnter() {}

    setDiffimgSize() {
        if (screen.availWidth >= 1080) {
            this.src = `../../../assets/img/home-img/${this.dayToBeat}_1595X510.jpg`;
        } else {
            if (screen.orientation.angle == 0 || screen.orientation.angle == 180) {
                this.src = `../../../assets/img/home-img/${this.dayToBeat}_390X311.jpg`;
            } else this.src = `../../../assets/img/home-img/${this.dayToBeat}_1254X570.jpg`;
        }
    }

    get dayToBeat(): string {
        let today = new Date().getDay();
        let some = '';
        switch (today) {
            case 1:
                some = 'A';
                break;
            case 2:
                some = 'B';
                break;
            case 3:
                some = 'C';
                break;
            case 4:
                some = 'D';
                break;
            case 5:
                some = 'E';
                break;
            default: {
                some = 'F';
            }
        }
        return some;
    }
}
