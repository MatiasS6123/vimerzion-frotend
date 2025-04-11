import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrl: './preguntas-frecuentes.component.css'
})
export class PreguntasFrecuentesComponent {
  activeIndex: number | null = null;

  faqs = [
    {
      pregunta: '¿Qué incluye el salón exclusivo para cumpleaños?',
      respuesta:
        'Incluye un sector exclusivo para el festejado y sus invitados, mesón y sillas hasta para 30 asistentes, snack dulce/salado individual y bebestible individual para cada invitado, anfitrión exclusivo y microondas.'
    },
    {
      pregunta: '¿Qué puedo llevar adicionalmente para la celebración?',
      respuesta:
        'Puedes llevar alimentos que no requieran cocción. Será responsabilidad del cliente el estado de los productos alimenticios. También puedes llevar tu cotillón, pero no se permite utilizar pegamento, cinta adhesiva ni elementos que dañen las instalaciones.'
    },
    {
      pregunta: '¿Qué no se permite durante las celebraciones?',
      respuesta:
        'No se puede llevar bebidas de ningún tipo, ni ingresar electrodomésticos. Se prohíbe el uso de papel picado (challa o similar) y fumar en las instalaciones.'
    },
    {
      pregunta: '¿Qué días y en qué horarios se puede celebrar un cumpleaños?',
      respuesta:
        'Se puede celebrar de lunes a domingo. Horario 1: entre las 11:00 AM y las 15:00 PM. Horario 2: entre las 16:00 PM y las 20:00 PM, según la promoción contratada.'
    },
    {
      pregunta: '¿Cuál es el mínimo y máximo de invitados (niños y adultos)?',
      respuesta:
        'El mínimo es de 10 invitados. Si asisten menos, se deberá pagar el mínimo contratado. El máximo es de 30 invitados según la promoción escogida. Se permite el ingreso de un adulto responsable por cada menor invitado.'
    },
    {
      pregunta: '¿Cuál es el procedimiento para reservar un cumpleaños?',
      respuesta:
        'Puedes reservar a través del sitio web o de forma presencial en el local de tu interés, realizando un abono de $100.000. Deberás indicar sucursal, cantidad de invitados, paquete elegido y fecha de celebración. Luego, la sucursal te contactará para coordinar detalles, firmar contrato y reconfirmar asistentes.'
    },
    {
      pregunta: '¿Cuánto tiempo antes de la fecha del cumpleaños debo reservar o solicitar una modificación?',
      respuesta:
        'Debes reservar con un mínimo de tres días hábiles antes de la celebración. Las modificaciones deben realizarse hasta cinco días hábiles antes de la fecha reservada.'
    },
    {
      pregunta: '¿Cuáles son los medios y formas de pago para la contratación de un cumpleaños?',
      respuesta:
        'Para reservar, debes abonar un mínimo de $100.000 y el resto se cancela el día de la celebración. Puedes pagar con tarjeta de débito o crédito, y en forma presencial también en efectivo.'
    },
    {
      pregunta: '¿Cuál es el uso de pulseras durante el cumpleaños?',
      respuesta:
        'Al inicio de la celebración se entregan pulseras para identificar a los invitados con acceso gratuito (freepass) a experiencias virtuales. La pulsera no incluye participación en desafíos y torneos.'
    },
    {
      pregunta: '¿Tienen estacionamiento privado en su establecimiento?',
      respuesta:
        'No, no disponemos de estacionamiento privado en nuestro establecimiento.'
    },
    {
      pregunta: '¿Dónde puedo estacionar cerca de su local?',
      respuesta:
        'Puedes estacionar en el estacionamiento del Mall Costanera Center (lunes a domingo todo el día) o en la calle Bucarest, donde hay dos estacionamientos pagados (lunes a viernes todo el día, sábados de 10:00 a 15:00).'
    },
    {
      pregunta: '¿Cuánto cuesta el estacionamiento cerca de su local?',
      respuesta:
        'El costo varía según el estacionamiento que elijas. El valor promedio es de $2.500 por hora.'
    },
    {
      pregunta: '¿Dónde se encuentra el local Vimerzion Center?',
      respuesta:
        'El local está ubicado en Av. Nueva Los Leones 030 - 050, Local 60.'
    }
  ];
  
  toggle(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' }); // ← Esto asegura que siempre inicie arriba
  }
}
