import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbersReportsComponent } from './barbers-reports.component';

describe('BarbersReportsComponent', () => {
  let component: BarbersReportsComponent;
  let fixture: ComponentFixture<BarbersReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbersReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
