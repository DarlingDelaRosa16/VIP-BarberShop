import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOutboundComponent } from './create-outbound.component';

describe('CreateOutboundComponent', () => {
  let component: CreateOutboundComponent;
  let fixture: ComponentFixture<CreateOutboundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOutboundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOutboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
