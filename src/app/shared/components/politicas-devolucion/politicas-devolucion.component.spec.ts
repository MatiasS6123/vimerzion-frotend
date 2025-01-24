import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasDevolucionComponent } from './politicas-devolucion.component';

describe('PoliticasDevolucionComponent', () => {
  let component: PoliticasDevolucionComponent;
  let fixture: ComponentFixture<PoliticasDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticasDevolucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticasDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
