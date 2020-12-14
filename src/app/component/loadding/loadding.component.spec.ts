import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaddingComponent } from './loadding.component';

describe('LoaddingPage', () => {
    let component: LoaddingComponent;
    let fixture: ComponentFixture<LoaddingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoaddingComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoaddingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
