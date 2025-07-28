import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductDataComponent } from './detail-product-data.component';

describe('DetailProductDataComponent', () => {
  let component: DetailProductDataComponent;
  let fixture: ComponentFixture<DetailProductDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProductDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProductDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
