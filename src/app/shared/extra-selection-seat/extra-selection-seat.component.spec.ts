import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraSelectionSeatComponent } from './extra-selection-seat.component';

describe('ExtraSelectionSeatComponent', () => {
  let component: ExtraSelectionSeatComponent;
  let fixture: ComponentFixture<ExtraSelectionSeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraSelectionSeatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtraSelectionSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
