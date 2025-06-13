import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-tipo-servicio',
  templateUrl: './tipo-servicio.component.html',
  styleUrls: ['./tipo-servicio.component.css'],
  standalone: true,
  imports: [CarouselModule, CommonModule,RouterModule]
})
export class TipoServicioComponent implements OnInit {
  tipoServicio: string | null = '';
  userSelection: string | null = '';
  currentIndex: number = 0;
  fotos: any[] = [];
  currentPlanIndex: number = 0;
  currentUrl: string = '';



  // Datos de ejemplo
  datos: { [key: string]: { [key: string]: { imagenUrl: string; titulo: string; descripcion: string; planes?: { nombre: string; valor: string; detalles: string; }[];}[] } } = {
    Empresas: {
      local: [
        {
          imagenUrl: 'assets/arriendolocalempresa.jpg',
          titulo: 'Arriendo del local',
          descripcion: `Sorprende a tu equipo con una experiencia inmersiva Nuestro local de realidad virtual es el
          lugar ideal para una actividad extra programática que combine diversión e innovación`
        },
        {
          imagenUrl: 'assets/reunionlocalempresa.jpg',
          titulo: 'Salon de reuniones en local',
          descripcion: `Utiliza nuestra sala de reuniones equipada con tecnología de realidad virtual para tus
          reuniones y presentaciones.`
        },
        {
          imagenUrl: 'assets/teamlocal.jpg',
          titulo: 'Team building en local',
          descripcion: `Disfruta de nuestras emocionantes salas de escape, desafíos colaborativos y otras
          actividades inmersivas, todas diseñadas para unir a tu equipo`
        },
      ],
      domicilio: [
        {
          imagenUrl: 'assets/eventosCorporativosVR.jpg',
          titulo: 'Eventos corporativos a Domicilio',
          descripcion: `!Transforma tus eventos con experiencias interactivas y emocionantes. Nuestros
          simuladores envolventes pueden ser disfrutados en cualquier lugar. ¡Innova y deja una
          impresión duradera en tus clientes!`
        },
        {
          imagenUrl: 'assets/activacionesPublicitariasVR.jpg',
          titulo: 'Activaciones Publicitarias a Domicilio',
          descripcion: `Haz que tu marca cobre vida. Transporta a tu audiencia a un mundo virtual cautivador y
          conecta con ellos de manera envolvente. ¡Destaca tu marca y crea un impacto duradero!`
        },
        {
          imagenUrl: 'assets/teamBuildingVrDom.jpg',
          titulo: 'Team Building VR a Domicilio',
          descripcion: `Fortalece los lazos de tu equipo con nuestras actividades colaborativas evirtual. Resuelve
          desafíos y alcanza objetivos comunes en un entorno inmersivo, ¡Potencia el trabajo en
          equipo desde tu oficina!`
        },
      ]
    },
    Personas: {
      local: [
        {
          imagenUrl: 'assets/a.jpeg',
          titulo: 'Arriendo en local',
          descripcion: `Visítanos en Av. Nueva Los Leones 030, Local 60. Providencia. Santiago de Chile. (A pasos del Mall Costanera Center) 
          <br><strong>Horarios: Martes a sábados, 14:00 - 20:00 horas.</strong> Descubre nuestra amplia variedad de
          simuladores de realidad virtual.<br>`,
          planes: [
            { 
              nombre: 'TARIFA TEMPORAL', 
              valor: '',   
              detalles: '1 a 10 min $2.000.<br>11 a 20 min $4.000.<br>21 a 30 min $5.000.<br>31 a 40 min $7.000.<br>41 a 50 min $9.000.<br>51 a 60 min $10.000.' 
            },
            { 
              nombre: 'PUNTOS DE JUEGO', 
              valor: '',   
              detalles: '1 punto $1.000.<br>5 puntos $5.000.<br>12 puntos $10.000.<br>24 puntos $20.000.<br>36 puntos $30.000.<br>50 puntos $40.000.' 
            }          
          ]
        },
        {
          imagenUrl: 'assets/e.jpeg',
          titulo: 'Salon de cumpleaños en local',
          descripcion: `Celebra tu día especial en nuestro centro de Realidad Virtual, donde la diversión no tiene
          límites. ¡Conoce nuestras promociones y haz que tu celebración sea inolvidable!`,
          planes: [
            { nombre: 'PROMO BASIC',
              valor: '$20.000 c/u (3 horas)',
              detalles: 'Mínimo: 10 invitados.<br>Máximo: 20 invitados.<br>Salón cumpleaños exclusivo.<br>Sala virtual exclusiva.<br>4 simuladores virtuales.<br>Snack para cada invitado.<br>Distintivo festejado.<br>Regalo festejado.' },
            { 
              nombre: 'PROMO PREMIUM', 
              valor: '$25.000 c/u (3 horas)',   
              detalles: 'Mínimo: 10 invitados.<br>Máximo: 25 invitados.<br>Salón cumpleaños exclusivo.<br>Sala virtual exclusiva.<br>5 simuladores virtuales.<br>Snack para cada invitado.<br>Distintivo festejado.<br>Regalo festejado.' 
            },
            { 
              nombre: 'PROMO DELUXE', 
              valor: '$30.000 c/u (4 horas)',   
              detalles: 'Mínimo: 10 invitados.<br>Máximo: 30 invitados.<br>Salón cumpleaños exclusivo.<br>Sala virtual exclusiva.<br>6 simuladores virtuales.<br>Snack para cada invitado.<br>Distintivo festejado.<br>Regalo festejado.' 
            }            
            ]
        },
        {
          imagenUrl: 'assets/otroslocal.jpg',
          titulo: 'Otros eventos en local',
          descripcion: `Ya sea una junta con amigos, una celebración de graduación o un paseo de curso, nuestro
          centro de realidad virtual es el lugar ideal para ti. Arrendamos nuestro espacio y ofrecemos
          una variedad de servicios para hacer que tu evento sea único`
        }
      ],
      domicilio: [
        {
          imagenUrl: 'assets/personal.jpg',
          titulo: 'Arriendo a Domicilio',
          descripcion: `¡Lleva la innovación a tu hogar! 
          Arrienda nuestros dispositivos de última generación y accede a una amplia variedad de videojuegos y experiencias inmersivas.`
        },
        {
          imagenUrl: 'assets/cumpleaños.jpg',
          titulo: 'Fiestas de Cumpleaños a Domicilio',
          descripcion: `¡Celebra tu cumpleaños de manera inolvidable! Nuestro servicio te permite disfrutar de
          increíbles experiencias virtuales en la comodidad de tu hogar.`
        },
        {
          imagenUrl: 'assets/otras.jpg',
          titulo: 'Otros eventos a Domicilio',
          descripcion: `LLena de emoción y novedad a tus eventos especiales con nuestras experiencias únicas.
          Celebra aniversarios, matrimonios, Kermesses y muchos más.`
        }
      ]

    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tipoServicio = params.get('tipo');
      this.userSelection = localStorage.getItem('userSelection') || 'Personas';
      this.cargarDatos();
    });
     this.currentUrl = this.router.url;

    // Suscribirse a los cambios de ruta en caso de navegación dentro del SPA
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }
  serviciosParaPersonas = ['local', 'domicilio', 'otroTipo']; // ajusta los que correspondan

  shouldShowOptions(): boolean {
    // Oculta si incluye exactamente "/tipo-servicio/domicilio"
    return !this.currentUrl.includes('/tipo-servicio/domicilio');
  }
  esArriendoLocalParaPersonas(): boolean {
    const tipo = this.tipoServicio?.toLowerCase(); // puede ser undefined, por eso usamos el ?
    const tituloActual = this.fotos[this.currentIndex]?.titulo?.toLowerCase(); // también puede ser undefined

    return !!tipo && this.serviciosParaPersonas.includes(tipo) &&
          tituloActual === 'arriendo en local';
  }

  cargarDatos(): void {
    if (this.tipoServicio && this.userSelection) {
      this.fotos = this.datos[this.userSelection]?.[this.tipoServicio] || [];

      if (this.fotos.length === 0) {
        this.fotos = [{
          imagenUrl: 'assets/default-image.jpg',
          titulo: 'Servicio no disponible',
          descripcion: 'Actualmente no hay imágenes disponibles para este servicio.'
        }];
      }
    }
  }

  botonTexto: string = 'Cotiza aquí';

  getTextoBoton(): string {
    const servicio = this.fotos[this.currentIndex];
    
    if (!servicio) return 'Cotiza aquí';
  
    if (servicio.titulo === 'Salon de cumpleaños en local'  || servicio.titulo === 'Otros eventos en local') {
      return 'RESERVA AQUÍ';
    }
  
    if (servicio.planes?.length > 0) {
      return 'RESERVA AQUÍ';
    }
  
    return 'Cotiza aquí';
  }
  
  onBotonClick(): void {
  const servicio = this.fotos[this.currentIndex];

  // ✅ Si es domicilio, redirige a una página específica
  if (this.tipoServicio === 'domicilio') {
    window.open('https://vimerzion.com/tienda', '_blank');
    return;
  }

  if (!servicio) return;

  if (
    servicio.titulo === 'Salon de cumpleaños en local' ||
    servicio.titulo === 'Otros eventos en local' ||
    servicio.titulo === 'Arriendo en local' ||
    servicio.titulo === 'Salon de reuniones en local' ||
    servicio.titulo === 'Team building en local'
  ) {
    const params = new URLSearchParams({
      servicio: servicio.titulo
    }).toString();
      //window.open(`http://localhost:4200/contacto?${params}`, '_blank');
    window.open(`https://vimerzion.com/contacto?${params}`, '_blank');
  } else if (servicio.planes?.length > 0) {
    window.open('https://tuweb.com/recarga', '_blank');
  } else {
    const params = new URLSearchParams({
      servicio: servicio.titulo
    }).toString();
     //window.open(`http://localhost:4200/contacto?${params}`, '_blank');
    window.open(`https://vimerzion.com/contacto?${params}`, '_blank');
  }
}

  irAPreguntasFrecuentes(): void {
    const servicio = this.fotos[this.currentIndex];
    if (!servicio?.titulo) return;
  
    // Normaliza el título para usarlo como "origen"
    const origen = servicio.titulo
      .toLowerCase()
      .replace(/\s+/g, '-')  // Reemplaza espacios por guiones
      .replace(/[^\w\-]+/g, ''); // Elimina caracteres especiales
  
    // Redirige con el origen como query param
    window.open(`/preguntas-frecuentes?origen=${origen}`, '_blank');
  }
  

  prevSlide(): void {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.fotos.length - 1;
    this.getTextoBoton();
  }

  nextSlide(): void {
    this.currentIndex = this.currentIndex < this.fotos.length - 1 ? this.currentIndex + 1 : 0;
    this.getTextoBoton();
  }

  prevPlanSlide(): void {
    this.currentPlanIndex = this.currentPlanIndex > 0 ? this.currentPlanIndex - 1 : this.fotos[this.currentIndex].planes.length - 1;
  }

  nextPlanSlide(): void {
    this.currentPlanIndex = this.currentPlanIndex < this.fotos[this.currentIndex].planes.length - 1 ? this.currentPlanIndex + 1 : 0;
  }
}
