import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastThingCardComponent } from './last-thing-card.component';

describe('LastThingCardComponent', () => {
  let component: LastThingCardComponent;
  let fixture: ComponentFixture<LastThingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastThingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastThingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
