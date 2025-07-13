import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Desafio } from '../../../models/desafios'; // Ajusta esto a tu modelo real

@Component({
  selector: 'app-vista-administrador',
  templateUrl: './vista-administrador.component.html'
})
export class VistaAdministradorComponent {
  @Input() desafios: Desafio[] = [];
  @Input() desafioForm!: FormGroup;
  @Input() isEditMode: boolean = false;
  @Input() mostrarFormulario: boolean = false;

  @Input() onSubmit!: () => void;
  @Input() onCancel!: () => void;
  @Input() onDelete!: (id: string) => void;
}
