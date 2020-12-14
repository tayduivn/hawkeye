import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionPage } from './user-permission.page';

describe('UserPermissionPage', () => {
    let component: UserPermissionPage;
    let fixture: ComponentFixture<UserPermissionPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserPermissionPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserPermissionPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
