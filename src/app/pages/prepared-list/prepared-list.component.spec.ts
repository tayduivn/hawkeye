import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparedListComponent } from './prepared-list.component';

describe('PreparedListComponent', () => {
  let component: PreparedListComponent;
  let fixture: ComponentFixture<PreparedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparedListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
