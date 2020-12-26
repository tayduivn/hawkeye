import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdOverflowTextComponent } from './td-overflow-text.component';

describe('TdOverflowTextComponent', () => {
    let component: TdOverflowTextComponent;
    let fixture: ComponentFixture<TdOverflowTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TdOverflowTextComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TdOverflowTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
