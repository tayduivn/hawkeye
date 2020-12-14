import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyModeComponent } from './reply-mode.component';

describe('ReplyModeComponent', () => {
    let component: ReplyModeComponent;
    let fixture: ComponentFixture<ReplyModeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReplyModeComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReplyModeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
