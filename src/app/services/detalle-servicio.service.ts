import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {

  private servicios = [
    {
      titulo: 'Hologramas 3D',
      descripcion: `
        <p>Sumérgete en el fascinante mundo de los hologramas 3D y sorprende a tu audiencia con una experiencia visual única.</p>
        <ul>
          <li>Ventilador holográfico (60 cm de diámetro): Este dispositivo utiliza hélices equipadas con MICRO LED que giran a gran velocidad para proyectar diseños 2D y 3D en el aire. Desde logotipos hasta figuras tridimensionales.</li>
          <li>Diseños 3D predeterminados (5): Tendrás acceso a cinco diseños predefinidos que dejarán boquiabierta a tu audiencia.</li>
          <li>Animaciones 3D con imágenes o fotografías: Añade un toque dinámico y personalizado a tus presentaciones holográficas. Carga tus propias imágenes o fotografías y observa cómo cobran vida en tres dimensiones.</li>
          <li>Pedestal resistente (2 metros): El soporte garantiza que tu holograma se mantenga estable y visible durante tus exposiciones.</li>
        </ul>
      `,
      imagenUrl: 'ruta-a-imagen-hologramas.jpg',
    },
    {
      titulo: 'Simuladores de carreras',
      descripcion: `
        <p>Son un conjunto de elementos que garantizan una <strong>experiencia de conducción realista y emocionante</strong> para los amantes de los autos y las carreras. Incluye:</p>
        <ul>
          <li>
            <strong>Butaca playseat:</strong> Simula a la perfección las dimensiones y la conducción de un automóvil con su respectivo volante, pedales y palanca de cambios.
          </li>
          <li>
            <strong>Artefacto de realidad virtual Playstation VR o Playstation VR2:</strong> Ofrece variadas experiencias de conducción, tales como circuitos de carrera y rally.
          </li>
          <li>
            <strong>Plataforma metálica:</strong> Proporciona la altura óptima para subir y disfrutar de la experiencia al máximo. Esta plataforma también permite personalizarla con tu marca o logotipo (branding) en todas sus caras visibles.
          </li>
          <li>
            <strong>Televisión de 50 pulgadas:</strong> Transmite las experiencias y permite que los espectadores presencien las actividades, mejorando la interacción en tiempo real.
          </li>
        </ul>
      `,
      imagenUrl: 'ruta-a-imagen-simuladores-carreras.jpg',
    },
    {
      titulo: 'Simulador de vuelo',
      descripcion: `
        <p>Son un conjunto de elementos diseñados para brindarte una <strong>experiencia llena de acción y adrenalina</strong>. En este entorno, vivirás aventuras en el aire que te harán sentir la emoción de pilotar. Incluye:</p>
        <ul>
          <li>
            <strong>Butaca con joystick Hotas:</strong> De alta precisión y un acelerador de tamaño real que combina precisión, comodidad y exactitud en cada movimiento.
          </li>
          <li>
            <strong>Artefacto de realidad virtual Play Station VR2:</strong> Con variadas experiencias de vuelo tales como combate aéreo, aventura espacial y vuelo civil, entre otros.
          </li>
          <li>
            <strong>Plataforma metálica:</strong> Proporciona la altura óptima para subir y disfrutar de la experiencia al máximo. Esta plataforma también ofrece la posibilidad de personalizarla con tu marca o logotipo (branding) en todas sus caras visibles.
          </li>
          <li>
            <strong>Televisión de 50 pulgadas:</strong> Transmite las experiencias y permite que los espectadores presencien las actividades en tiempo real.
          </li>
        </ul>
      `,
      imagenUrl: 'ruta-a-imagen-simulador-vuelo.jpg',
    },
    {
      titulo: 'Simulador de parapente',
      descripcion: `
        <p>Son un conjunto de elementos diseñados para brindar una <strong>experiencia de vuelo realista</strong>, permitiendo al usuario experimentar la sensación de estar en el aire. Incluye:</p>
        <ul>
          <li>
            <strong>Silla de vuelo:</strong> A escala real con mandos funcionales que simulan el control del parapente con cable de acero, poleas y mosquetones.
          </li>
          <li>
            <strong>Artefacto de realidad virtual Meta Quest 2:</strong> Ofrece experiencias de parapente en diversos entornos, como nieve y montaña.
          </li>
          <li>
            <strong>Estructura metálica robusta:</strong> Proporciona la altura óptima y asegura la estabilidad durante la experiencia.
          </li>
          <li>
            <strong>Televisión de 50 pulgadas:</strong> Transmite las experiencias y permite que los espectadores presencien las actividades.
          </li>
        </ul>
      `,
      imagenUrl: 'ruta-a-imagen-simulador-parapente.jpg',
    },
    {
      titulo: 'Plataforma 360° View',
      descripcion: `
        <p>Son un conjunto de elementos que garantizan una <strong>experiencia fotográfica en 360 grados</strong>. Imagina capturar momentos desde todos los ángulos posibles. Incluye:</p>
        <ul>
          <li>
            <strong>Plataforma giratoria:</strong> En la cual el celular puede girar 360 grados, asegurando así la grabación de videos panorámicos dinámicos.
          </li>
          <li>
            <strong>Smartphone de primera línea (iPhone 13):</strong> Este dispositivo te permitirá grabar tus experiencias en cámara lenta y rápida, añadiendo un toque creativo a tus videos.
          </li>
          <li>
            <strong>Variado cotillón:</strong> Máquina de burbujas, luces LED, alfombra y separadores de fila para una ambientación de lujo.
          </li>
          <li>
            <strong>Televisión de 50 pulgadas:</strong> Permite transmitir las experiencias y descargar los videos a través de un código QR.
          </li>
        </ul>
      `,
      imagenUrl: 'ruta-a-imagen-plataforma-360.jpg',
    },
    {
      titulo: 'Estaciones virtuales',
      descripcion: `
        <p>Son un conjunto de elementos que ofrecen una <strong>experiencia inmersiva y segura</strong>. Te sumergen en un universo virtual, haciéndote sentir como si estuvieras dentro de él. Incluye:</p>
        <ul>
          <li>
            <strong>Plataforma virtual:</strong> La cual sostiene a los participantes y gira en 360°, asegurando gran movilidad al momento de interactuar con el entorno VR.
          </li>
          <li>
            <strong>Artefacto de realidad virtual Meta Quest 2:</strong> Con variadas experiencias, tales como escalar una montaña, volar por los cielos, caer desde un precipicio, juegos rítmicos y mucho más.
          </li>
          <li>
            <strong>Chaleco háptico:</strong> El cual reproduce vibraciones según los estímulos de algunas de nuestras experiencias. Por ejemplo, al recibir un golpe, un disparo o al tocar batería en nuestro juego rítmico.
          </li>
          <li>
            <strong>Televisión de 50 pulgadas:</strong> Para transmitir las experiencias y permitir que los espectadores presencien las actividades.
          </li>
        </ul>
      `,
      imagenUrl: 'ruta-a-imagen-estaciones-virtuales.jpg',
    },
  ];

  getServicioDetalles(titulo: string) {
    return this.servicios.find((servicio) => servicio.titulo === titulo);
  }
}
