import { GlobalModalService } from './../../component/global-modal/global-modal.service';
import { NzModalService } from 'ng-zorro-antd';
import { NotifyService } from './../service/notify.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GlobalModalType } from 'src/app/component/global-modal/global-modal.component';

@Component({
    selector: 'app-notify',
    templateUrl: './notify.component.html',
    styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit, GlobalModalType {
    @ViewChild('tplTitle', { static: true }) tplTitle: ElementRef;
    @ViewChild('tplContent', { static: true }) tplContent: ElementRef;
    @ViewChild('tplFooter', { static: true }) tplFooter: ElementRef;

    _list: Array<string> = [];
    constructor(public notify: NotifyService,public globalModal:GlobalModalService) {}
    cancel?(): void {
        throw new Error('Method not implemented.');
    }
    nzWidth: string = '650px';
    enter(): void {}

    ngOnInit() {
        this.notify.list$.subscribe(res => {
            console.log(res);
        });
    }
}
