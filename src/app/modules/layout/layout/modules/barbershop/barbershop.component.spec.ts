import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopComponent } from './barbershop.component';

describe('BarbershopComponent', () => {
  let component: BarbershopComponent;
  let fixture: ComponentFixture<BarbershopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
