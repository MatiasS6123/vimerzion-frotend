import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioFechasComponent } from './calendario-fechas.component';

describe('CalendarioFechasComponent', () => {
  let component: CalendarioFechasComponent;
  let fixture: ComponentFixture<CalendarioFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioFechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
