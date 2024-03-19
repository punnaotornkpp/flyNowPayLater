import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplateComponent } from './complate.component';

describe('ComplateComponent', () => {
  let component: ComplateComponent;
  let fixture: ComponentFixture<ComplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
