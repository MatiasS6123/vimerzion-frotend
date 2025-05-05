import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosYGemasComponent } from './puntos-y-gemas.component';

describe('PuntosYGemasComponent', () => {
  let component: PuntosYGemasComponent;
  let fixture: ComponentFixture<PuntosYGemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuntosYGemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuntosYGemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
