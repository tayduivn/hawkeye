import { ChipboardDirective } from './chipboard.directive';
import { InputBlurVerDirective } from './input-blur-ver.directive';
import { ImgPrevloadDirective } from './img-prevload.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryDirective } from './gallery.directive';
import { IonicModule } from '@ionic/angular';
import { MouseScrollBarDirective } from './mouse-scroll-bar.directive';
import { FilterTextPipe } from '../pipe/filter-text.pipe';

@NgModule({
    declarations: [
        GalleryDirective,
        ImgPrevloadDirective,
        InputBlurVerDirective,
        MouseScrollBarDirective,
        ChipboardDirective,
        FilterTextPipe,
    ],
    imports: [CommonModule, IonicModule],
    exports: [
        GalleryDirective,
        ImgPrevloadDirective,
        InputBlurVerDirective,
        MouseScrollBarDirective,
        ChipboardDirective,
        FilterTextPipe,
    ],
})
export class DirectiveModule {}
