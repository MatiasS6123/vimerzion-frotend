import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrl: './preguntas-frecuentes.component.css'
})
export class PreguntasFrecuentesComponent {
  activeIndex: number | null = null;

  faqs: any[] = []; 
  filteredFaqs = [];
  faqsOriginal: any[] = []; // Todas las preguntas


  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Inicializa preguntas completas
    this.faqs = [
  {
    origen: ['arriendo-en-local','salon-de-cumpleaos-en-local','otros-eventos-en-local','todos'],
    pregunta: '¿Desde qué edad es recomendado usar realidad virtual?',
    respuesta: 'La edad recomendada para usar realidad virtual es a partir de los 10 años. Esto se debe a que el contenido y la experiencia requieren cierto nivel de comprensión y tolerancia física para el uso de los dispositivos.'
  },
  {
    origen: ['arriendo-en-local','salon-de-cumpleaos-en-local','otros-eventos-en-local','arriendo-del-local','salon-de-reuniones-en-local','team-building-en-local','eventos-corporativos-a-domicilio','todos'],
    pregunta: '¿Cuáles son las contraindicaciones o condiciones de salud que requieren precaución al utilizar realidad virtual?',
    respuesta: 'Personas con epilepsia, embarazo, problemas de visión, afecciones cardíacas o de equilibrio deben consultar a un especialista antes de utilizar dispositivos de realidad virtual.'
  },
  {
    origen: ['otros-eventos-en-local'],
    pregunta: '¿Qué tipos de eventos podría celebrar?',
    respuesta: 'Puedes celebrar todo tipo de eventos particulares, como: eventos de colegio, eventos de diferentes comunidades, juntas de videojuegos y muchos más. Nuestro espacio es flexible y se adapta a tus necesidades.'
  },
  {
    origen: ['otros-eventos-en-local','salon-de-cumpleaos-en-local','salan-de-reuniones-en-local'],
    pregunta: '¿Cuál es la tarifa?',
    respuesta: 'Nuestra tarifa depende de la magnitud del evento. Por favor, contáctanos con información sobre: número de asistentes, duración del evento, servicios requeridos, y fecha y hora del evento. Estaremos encantados de proporcionarte una cotización personalizada.'
  },
  {
    origen: ['salon-de-reuniones-en-local','eventos-corporativos-a-domicilio'],
    pregunta: '¿Qué incluye el salón para reuniones y eventos corporativos?',
    respuesta: 'Incluye un sector exclusivo para la empresa y sus invitados, mesón y sillas hasta para 30 asistentes, snack dulce/salado individual y bebestible individual para cada invitado, anfitrión exclusivo y microondas.'
  },
  {
    origen: ['arriendo-en-local','salon-de-cumpleaos-en-local','otros-eventos-en-local','arriendo-del-local','salon-de-reuniones-en-local','team-building-en-local','eventos-corporativos-a-domicilio'],
    pregunta: '¿Tienen estacionamiento privado en su establecimiento?',
    respuesta: 'No, no disponemos de estacionamiento privado en nuestro establecimiento.'
  },
  {
    origen: ['arriendo-en-local','salon-de-cumpleaos-en-local','otros-eventos-en-local','arriendo-del-local','salon-de-reuniones-en-local','team-building-en-local','eventos-corporativos-a-domicilio'],
    pregunta: '¿Dónde puedo estacionar cerca de su local?',
    respuesta: 'Puedes estacionar en el estacionamiento del Mall Costanera Center (lunes a domingo todo el día) o en la calle Bucarest, donde hay dos estacionamientos pagados (lunes a viernes todo el día, sábados de 10:00 a 15:00).'
  },
  {
    origen: ['arriendo-en-local','salon-de-cumpleaos-en-local','otros-eventos-en-local','arriendo-del-local','salon-de-reuniones-en-local','team-building-en-local','eventos-corporativos-a-domicilio'],
    pregunta: '¿Cuánto cuesta el estacionamiento cerca de su local?',
    respuesta: 'El costo varía según el estacionamiento que elijas. El valor promedio es de $2.500 por hora.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Qué incluye el salón exclusivo para cumpleaños?',
    respuesta: 'Incluye un sector exclusivo para el festejado y sus invitados, mesón y sillas hasta para 30 asistentes, snack dulce/salado individual y bebestible individual para cada invitado, anfitrión exclusivo y microondas.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Qué puedo llevar adicionalmente para la celebración?',
    respuesta: 'Puedes llevar alimentos que no requieran cocción. Será responsabilidad del cliente el estado de los productos alimenticios. También puedes llevar tu cotillón, pero no se permite utilizar pegamento, cinta adhesiva ni elementos que dañen las instalaciones.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Qué no se permite durante las celebraciones?',
    respuesta: 'No se puede llevar bebidas de ningún tipo, ni ingresar electrodomésticos. Se prohíbe el uso de papel picado (challa o similar) y fumar en las instalaciones.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Qué días y en qué horarios se puede celebrar un cumpleaños?',
    respuesta: 'Se puede celebrar de lunes a domingo. Horario 1: entre las 11:00 AM y las 15:00 PM. Horario 2: entre las 16:00 PM y las 20:00 PM, según la promoción contratada.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Cuál es el mínimo y máximo de invitados (niños y adultos)?',
    respuesta: 'El mínimo es de 10 invitados. Si asisten menos, se deberá pagar el mínimo contratado. El máximo es de 30 invitados según la promoción escogida. Se permite el ingreso de un adulto responsable por cada menor invitado.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Cuál es el procedimiento para reservar un cumpleaños?',
    respuesta: 'Puedes reservar a través del sitio web o de forma presencial en el local de tu interés, realizando un abono de $100.000. Deberás indicar sucursal, cantidad de invitados, paquete elegido y fecha de celebración. Luego, la sucursal te contactará para coordinar detalles, firmar contrato y reconfirmar asistentes.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Cuánto tiempo antes de la fecha del cumpleaños debo reservar o solicitar una modificación?',
    respuesta: 'Debes reservar con un mínimo de tres días hábiles antes de la celebración. Las modificaciones deben realizarse hasta cinco días hábiles antes de la fecha reservada.'
  },
  {
    origen: ['salon-de-cumpleaos-en-local'],
    pregunta: '¿Cuáles son los medios y formas de pago para la contratación de un cumpleaños?',
    respuesta: 'Para reservar, debes abonar un mínimo de $100.000 y el resto se cancela el día de la celebración. Puedes pagar con tarjeta de débito o crédito, y en forma presencial también en efectivo.'
  },
  {
    origen: ['team-building-en-local'],
    pregunta: '¿Cuántas personas pueden participar al mismo tiempo en la experiencia de team building?',
    respuesta: 'Disponemos de experiencias con capacidad para hasta 6 participantes por dispositivo virtual y también ofrecemos experiencias multijugador con hasta 4 dispositivos virtuales simultáneos.'
  },
  {
    origen: ['arriendo-en-local','salon-de-cumpleaos-en-local','otros-eventos-en-local','arriendo-del-local','salon-de-reuniones-en-local','team-building-en-local','eventos-corporativos-a-domicilio'],
    pregunta: '¿Dónde se encuentra el local Vimerzion Center?',
    respuesta: 'El local está ubicado en Av. Nueva Los Leones 030 - 050, Local 60.'
  }
];

    this.faqsOriginal = [...this.faqs];

    // Obtiene origen de la URL y filtra preguntas
    this.route.queryParams.subscribe(params => {
      const origen = params['origen'] || 'todos';
      this.filtrarPreguntas(origen);
    });
  }

  filtrarPreguntas(origen: string): void {
    console.log('🔍 Origen recibido:', origen);
  
    this.faqs = this.faqsOriginal.filter(p => {
      console.log('👉 Comparando con:', p.origen);
  
      const coincide = p.origen.includes(origen) || p.origen.includes('todos');
      console.log('✅ ¿Coincide?', coincide);
  
      return coincide;
    });
  
    console.log('📋 Preguntas filtradas:', this.faqs);
  }
  

  toggle(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  
}
