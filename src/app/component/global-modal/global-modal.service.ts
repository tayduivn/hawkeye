import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { ComponentRef, Injectable, TemplateRef } from '@angular/core';
import { GlobalModalType } from './global-modal.component';

@Injectable({
    providedIn: 'root',
})
export class GlobalModalService {
    create$: Subject<any> = new Subject();
    _modal: NzModalRef<unknown, any> = null;

    constructor(private modalCtrl: NzModalService) {}

    get modal() {
        return this._modal;
    }

    set modal(input: NzModalRef<unknown, any>) {
        this._modal = input;
    }

    create(currentComponentRef: ComponentRef<GlobalModalType>) {
        this.modal = this.modalCtrl.create({
            nzTitle: currentComponentRef.instance.tplTitle as TemplateRef<any>,
            nzContent: currentComponentRef.instance.tplContent as TemplateRef<any>,
            nzWidth: currentComponentRef.instance.nzWidth,
            // nzFooter: tplFooter,
            nzMaskClosable: false,
            nzClosable: false,
            nzOnOk: () => currentComponentRef.instance.enter(),
        });
    }

    dismiss() {
        this.modal.destroy();
    }
}

 
