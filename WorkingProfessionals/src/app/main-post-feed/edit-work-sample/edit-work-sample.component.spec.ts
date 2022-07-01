import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkSampleComponent } from './edit-work-sample.component';

describe('EditWorkSampleComponent', () => {
  let component: EditWorkSampleComponent;
  let fixture: ComponentFixture<EditWorkSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
