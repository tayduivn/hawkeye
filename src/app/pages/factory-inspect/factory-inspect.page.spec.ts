import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryInspectPage } from './factory-inspect.page';

describe('FactoryInspectPage', () => {
  let component: FactoryInspectPage;
  let fixture: ComponentFixture<FactoryInspectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryInspectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryInspectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
