import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDescPopupComponent } from './sku-desc-popup.component';

describe('SkuDescPopupComponent', () => {
    let component: SkuDescPopupComponent;
    let fixture: ComponentFixture<SkuDescPopupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SkuDescPopupComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkuDescPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
