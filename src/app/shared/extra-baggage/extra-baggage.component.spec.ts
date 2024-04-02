import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraBaggageComponent } from './extra-baggage.component';

describe('ExtraBaggageComponent', () => {
  let component: ExtraBaggageComponent;
  let fixture: ComponentFixture<ExtraBaggageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraBaggageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExtraBaggageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
