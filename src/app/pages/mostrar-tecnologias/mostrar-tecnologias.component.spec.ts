import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarTecnologiasComponent } from './mostrar-tecnologias.component';

describe('MostrarTecnologiasComponent', () => {
  let component: MostrarTecnologiasComponent;
  let fixture: ComponentFixture<MostrarTecnologiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarTecnologiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarTecnologiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
