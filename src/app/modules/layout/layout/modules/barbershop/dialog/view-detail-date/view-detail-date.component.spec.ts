import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailDateComponent } from './view-detail-date.component';

describe('ViewDetailDateComponent', () => {
  let component: ViewDetailDateComponent;
  let fixture: ComponentFixture<ViewDetailDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDetailDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDetailDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
