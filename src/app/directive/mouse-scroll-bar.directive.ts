import { Directive, HostListener, ElementRef } from '@angular/core';
@Directive({
    selector: '[MouseScrollBar]',
})
export class MouseScrollBarDirective {
    isDown: boolean = false;
    distance: number = 0;

    @HostListener('mousedown', ['$event'])
    onmousedown(e: any) {
        if (e.target.tagName != 'INPUT' || e.target.tagName != 'SELECT') {
            this.isDown = !this.isDown;
        }
        this.distance = e.clientX;
    }

    @HostListener('mouseover', ['$event'])
    mouseover(e: any) {
        if (this.isDown) {
            let clientX = e.clientX;
            let actual = this.distance - clientX; //拖动的距离
            this.el.nativeElement.scrollLeft += actual;
        }
    }

    @HostListener('mouseleave', ['$event'])
    mouseleave(e: any) {
        this.isDown = !this.isDown;
        this.distance = 0;
    }

    @HostListener('mouseup', ['$event'])
    mouseup(e: any) {
        this.isDown = !this.isDown;
        this.distance = 0;
    }

    constructor(private el: ElementRef) {}
}
