import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailFlightComponent } from './dialog-detail-flight.component';

describe('DialogDetailFlightComponent', () => {
  let component: DialogDetailFlightComponent;
  let fixture: ComponentFixture<DialogDetailFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDetailFlightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDetailFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
