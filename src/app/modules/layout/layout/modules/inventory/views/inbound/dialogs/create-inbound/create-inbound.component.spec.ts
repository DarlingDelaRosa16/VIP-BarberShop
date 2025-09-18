import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInboundComponent } from './create-inbound.component';

describe('CreateInboundComponent', () => {
  let component: CreateInboundComponent;
  let fixture: ComponentFixture<CreateInboundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInboundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
