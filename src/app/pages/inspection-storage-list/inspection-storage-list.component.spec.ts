import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionStorageListComponent } from './inspection-storage-list.component';

describe('InspectionStorageListComponent', () => {
  let component: InspectionStorageListComponent;
  let fixture: ComponentFixture<InspectionStorageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionStorageListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionStorageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
