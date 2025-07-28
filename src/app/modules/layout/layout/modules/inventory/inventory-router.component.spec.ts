import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRouterComponent } from './inventory-router.component';

describe('InventoryRouterComponent', () => {
  let component: InventoryRouterComponent;
  let fixture: ComponentFixture<InventoryRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryRouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
