import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutboundDispatchComponent } from './create-outbound-dispatch.component';

describe('CreateOutboundDispatchComponent', () => {
  let component: CreateOutboundDispatchComponent;
  let fixture: ComponentFixture<CreateOutboundDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOutboundDispatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOutboundDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
