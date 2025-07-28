import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInventoryComponent } from './dashboard-inventory.component';

describe('DashboardInventoryComponent', () => {
  let component: DashboardInventoryComponent;
  let fixture: ComponentFixture<DashboardInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
