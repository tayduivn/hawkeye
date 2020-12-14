import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsepcContractComponent } from './insepc-contract.component';

describe('InsepcContractComponent', () => {
    let component: InsepcContractComponent;
    let fixture: ComponentFixture<InsepcContractComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InsepcContractComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InsepcContractComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
