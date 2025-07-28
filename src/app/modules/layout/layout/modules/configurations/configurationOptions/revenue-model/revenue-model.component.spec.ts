import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueModelComponent } from './revenue-model.component';

describe('RevenueModelComponent', () => {
  let component: RevenueModelComponent;
  let fixture: ComponentFixture<RevenueModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
