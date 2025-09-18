import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsInboundComponent } from './view-details-inbound.component';

describe('ViewDetailsInboundComponent', () => {
  let component: ViewDetailsInboundComponent;
  let fixture: ComponentFixture<ViewDetailsInboundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDetailsInboundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailsInboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
