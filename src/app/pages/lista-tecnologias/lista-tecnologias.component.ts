import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-tecnologias',
  standalone: true,
  imports: [],
  templateUrl: './lista-tecnologias.component.html',
  styleUrl: './lista-tecnologias.component.css'
})
export class ListaTecnologiasComponent {
  private router=inject(Router)

  handleAction(): void {
    this.router.navigate(['/gestion-servicios'], { queryParams: { id: '6781aa587f2968791f5d00db' } });
  }

}
