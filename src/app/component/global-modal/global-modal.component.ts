import { GlobalModalService } from './global-modal.service';
import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    Type,
    TemplateRef,
    ElementRef,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
    selector: 'app-global-modal',
    templateUrl: './global-modal.component.html',
    styleUrls: ['./global-modal.component.scss'],
})
export class GlobalModalComponent implements OnInit {
    @ViewChild('target', { read: ViewContainerRef, static: false }) target: ViewContainerRef; //用来创建等对组件进行相关操作的
    currentComponentRef: ComponentRef<any> = null;

    constructor(
        private modal: NzModalService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private globalModal: GlobalModalService,
    ) {}

    ngOnInit() {
        this.globalModal.create$.subscribe(res => {
            this.createIntance(res);
        });
    }

    createIntance(dynamicComponent: Type<any>) {
        const intance = this.componentFactoryResolver.resolveComponentFactory(dynamicComponent);

        this.currentComponentRef = this.target.createComponent(intance);
        this.globalModal.create(this.currentComponentRef);
    }
}

//实现全局modal的确定和取消方法
export interface GlobalModalType {
    enter?(): void;
    cancel?(): void;
    nzWidth?: string;
    tplTitle?: ElementRef<any> | TemplateRef<any>;
    tplContent?: ElementRef<any> | TemplateRef<any>;
    nzFooter?: ElementRef<any> | TemplateRef<any>;
}
