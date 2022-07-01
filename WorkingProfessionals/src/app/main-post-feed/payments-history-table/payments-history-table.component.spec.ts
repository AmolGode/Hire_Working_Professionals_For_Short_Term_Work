import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsHistoryTableComponent } from './payments-history-table.component';

describe('PaymentsHistoryTableComponent', () => {
  let component: PaymentsHistoryTableComponent;
  let fixture: ComponentFixture<PaymentsHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsHistoryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
