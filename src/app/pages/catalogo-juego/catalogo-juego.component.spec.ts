import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoJuegoComponent } from './catalogo-juego.component';

describe('CatalogoJuegoComponent', () => {
  let component: CatalogoJuegoComponent;
  let fixture: ComponentFixture<CatalogoJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoJuegoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
