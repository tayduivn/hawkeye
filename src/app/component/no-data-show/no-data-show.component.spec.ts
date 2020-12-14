import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataShowComponent } from './no-data-show.component';

describe('NoDataShowPage', () => {
    let component: NoDataShowComponent;
    let fixture: ComponentFixture<NoDataShowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NoDataShowComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NoDataShowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
