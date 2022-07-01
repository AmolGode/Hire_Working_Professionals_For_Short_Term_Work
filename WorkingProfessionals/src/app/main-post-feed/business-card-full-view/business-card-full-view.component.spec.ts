import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardFullViewComponent } from './business-card-full-view.component';

describe('BusinessCardFullViewComponent', () => {
  let component: BusinessCardFullViewComponent;
  let fixture: ComponentFixture<BusinessCardFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessCardFullViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCardFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
