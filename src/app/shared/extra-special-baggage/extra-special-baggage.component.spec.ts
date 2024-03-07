import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraSpecialBaggageComponent } from './extra-special-baggage.component';

describe('ExtraSpecialBaggageComponent', () => {
  let component: ExtraSpecialBaggageComponent;
  let fixture: ComponentFixture<ExtraSpecialBaggageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraSpecialBaggageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtraSpecialBaggageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
