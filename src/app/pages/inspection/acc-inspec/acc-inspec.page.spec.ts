import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccInspecPage } from './acc-inspec.page';

describe('AccInspecPage', () => {
    let component: AccInspecPage;
    let fixture: ComponentFixture<AccInspecPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AccInspecPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccInspecPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
