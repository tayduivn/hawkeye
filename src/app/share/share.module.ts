import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { DirectiveModule } from '../directive/directive.module';
import { ComponentModule } from '../component/component.module';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
};

@NgModule({
    declarations: [],
    imports: [SwiperModule, CommonModule, ComponentModule, DirectiveModule],
    exports: [SwiperModule, ComponentModule, DirectiveModule],
})
export class ShareModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ShareModule,
            providers: [
                {
                    provide: SWIPER_CONFIG,
                    useValue: DEFAULT_SWIPER_CONFIG,
                },
            ],
        };
    }
}
