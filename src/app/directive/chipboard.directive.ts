import { Directive, ElementRef, HostListener, Renderer, Output, EventEmitter } from '@angular/core';
declare var ClipboardJS: any;
@Directive({
    selector: '[Chipboard]',
})

//must be input  " class='chip-text' Chipboard"
export class ChipboardDirective {
    @Output() chipboardDestroy = new EventEmitter<boolean>(); //just for ‘custom-popup.component’ component's ‘input' element for bug

    @HostListener('click', ['$event']) onclick(e: any) {
        this.chipboardDestroy && this.chipboardDestroy.emit(false);
        let $this = this;
        let clickBeforeColor = this.el.nativeElement.style.color;
        this.renderer.setElementStyle(this.el.nativeElement, 'color', 'rgb(51,143,255)');
        const clipText = new ClipboardJS('.chip-text', {
            text: function (trigger: HTMLElement) {
                return trigger.innerText;
            },
        });
        // e.stopPropagation()
        clipText.on('success', function (e: any) {
            setTimeout(() => {
                $this.renderer.setElementStyle(
                    $this.el.nativeElement,
                    'color',
                    clickBeforeColor ? clickBeforeColor : '#333',
                );
                $this.chipboardDestroy && $this.chipboardDestroy.emit(true);
            }, 200);
            clipText.destroy();
        });
    }
    constructor(private el: ElementRef, private renderer: Renderer) { }
}
