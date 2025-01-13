import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTecnologiasComponent } from './lista-tecnologias.component';

describe('ListaTecnologiasComponent', () => {
  let component: ListaTecnologiasComponent;
  let fixture: ComponentFixture<ListaTecnologiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTecnologiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTecnologiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
