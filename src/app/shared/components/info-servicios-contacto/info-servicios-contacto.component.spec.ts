import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoServiciosContactoComponent } from './info-servicios-contacto.component';

describe('InfoServiciosContactoComponent', () => {
  let component: InfoServiciosContactoComponent;
  let fixture: ComponentFixture<InfoServiciosContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoServiciosContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoServiciosContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
