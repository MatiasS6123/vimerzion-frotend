import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [],
  templateUrl: './detalle-servicio.component.html',
  styleUrl: './detalle-servicio.component.css'
})
export class DetalleServicioComponent {
  titulo: string = '';
  descripcion: string = '';
  imagenUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.titulo = params['titulo'];
      this.imagenUrl = params['imagen'];
      this.setDescripcion(this.titulo);
    });
  }

  // Método para asignar la descripción según el título
  setDescripcion(titulo: string): void {
    const descripciones: { [key: string]: string } = {
      'Simulador de vuelo': `
        <p>Son un conjunto de elementos diseñados para brindarte una experiencia llena de acción y adrenalina.</p>
        <ul>
          <li>Butaca con joystick Hotas de alta precisión.</li>
          <li>Artefacto de realidad virtual Play Station VR2.</li>
          <li>Plataforma metálica.</li>
          <li>Televisión de 50 pulgadas.</li>
        </ul>`,
      'Hologramas 3D': `
        <p>Sumérgete en el fascinante mundo de los hologramas 3D.</p>
        <ul>
          <li>Ventilador holográfico (60 cm de diámetro).</li>
          <li>Diseños 3D predeterminados (5).</li>
          <li>Animaciones 3D con imágenes o fotografías.</li>
          <li>Pedestal resistente (2 metros).</li>
        </ul>`,
      'Simuladores de carreras': `
        <p>Garantizan una experiencia de conducción realista y emocionante.</p>
        <ul>
          <li>Butaca playseat.</li>
          <li>Artefacto de realidad virtual Playstation VR2.</li>
          <li>Plataforma metálica.</li>
          <li>Televisión de 50 pulgadas.</li>
        </ul>`,
      'Simulador de parapente': `
        <p>Diseñado para brindarte una experiencia de vuelo realista.</p>
        <ul>
          <li>Silla de vuelo con mandos funcionales.</li>
          <li>Artefacto de realidad virtual Meta Quest 2.</li>
          <li>Estructura metálica robusta.</li>
          <li>Televisión de 50 pulgadas.</li>
        </ul>`,
      'Plataforma 360° View': `
        <p>Garantizan una experiencia fotográfica en 360 grados.</p>
        <ul>
          <li>Plataforma giratoria.</li>
          <li>Smartphone de primera línea.</li>
          <li>Variado cotillón.</li>
          <li>Televisión de 50 pulgadas.</li>
        </ul>`,
      'Estaciones virtuales': `
        <p>Ofrecen una experiencia inmersiva y segura.</p>
        <ul>
          <li>Plataforma virtual.</li>
          <li>Artefacto de realidad virtual Meta Quest 2.</li>
          <li>Chaleco háptico.</li>
          <li>Televisión de 50 pulgadas.</li>
        </ul>`
    };

    this.descripcion = descripciones[titulo] || '<p>Descripción no disponible.</p>';
  }

}
