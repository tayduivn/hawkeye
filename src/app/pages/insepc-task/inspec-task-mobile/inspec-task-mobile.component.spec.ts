import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspecTaskMobileComponent } from './inspec-task-mobile.component';

describe('InspecTaskMobileComponent', () => {
    let component: InspecTaskMobileComponent;
    let fixture: ComponentFixture<InspecTaskMobileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InspecTaskMobileComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InspecTaskMobileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
