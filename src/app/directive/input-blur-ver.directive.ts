import { project } from '../services/task.service';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { PageEffectService } from '../services/page-effect.service';

@Directive({
    selector: '[onBlurVer]',
})
export class InputBlurVerDirective implements OnInit {
    inspectoonMetadata: project;
    verFieldValue: string | number;
    @Input()
    verObject: verObject;

    @HostListener('blur', ['$event.target'])
    onBlur(btn: any) {
        if (btn.value) {
            //btn.value

            for (let key in this.inspectoonMetadata.sku_sys) {
                if (key == this.verObject.verField) {
                    if (Number(this.inspectoonMetadata.sku_sys[key]) != NaN) {
                        this.verFieldValue = Number(this.inspectoonMetadata.sku_sys[key]);
                    } else {
                        this.verFieldValue = this.inspectoonMetadata.sku_sys[key];
                    }
                }
            }
            if (btn.value != this.verFieldValue) {
                this.effectCtrl.showAlert({
                    header: '提示',
                    backdropDismiss: false,
                    message: `您输入的 ${this.verObject.verName} 确定是否输入正确？`,
                    buttons: [
                        {
                            text: '重新输入',
                            role: 'cancel',
                            handler: () => {
                                btn.value = null;
                                btn.focus();
                            },
                        },
                        {
                            text: '正确无误',
                            handler: () => {},
                        },
                    ],
                });
            }
        }
        console.log(btn.innerHTML);
    }

    constructor(private el: ElementRef, private effectCtrl: PageEffectService) {}

    ngOnInit() {
        this.inspectoonMetadata = JSON.parse(sessionStorage.getItem('INSPECTION_META_DATA'));
    }
}

export interface verObject {
    verField: string;
    verName: string;
}
