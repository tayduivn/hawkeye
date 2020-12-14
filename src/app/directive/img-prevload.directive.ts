import { Directive, Input, ElementRef, Renderer, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Directive({
    selector: 'img[imgPreview]',
})
export class ImgPrevloadDirective {
    @Input() image: any;

    constructor(private el: ElementRef, private renderer: Renderer) {}

    ngOnChanges(changes: SimpleChanges) {
        let reader = new FileReader();
        let el = this.el;

        reader.onload = function (e) {
            el.nativeElement.src = reader.result;
        };

        if (this.image) {
            return reader.readAsDataURL(this.image);
        }
    }
}
