import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaqueteComponent } from './modal-paquete.component';

describe('ModalPaqueteComponent', () => {
  let component: ModalPaqueteComponent;
  let fixture: ComponentFixture<ModalPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPaqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
