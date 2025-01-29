import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {

  // Servicios para Empresas
  private serviciosEmpresas = [
    {
      titulo: 'Team Building',
  descripcion: `
    <span class='text-[#00eefd]'>(+10 actividades colaborativas)</span>
    <br>

    Sumérgete en una <span class='text-[#00eefd]'>experiencia única</span> de Team Building en realidad virtual. Nuestras innovadoras actividades combinan la emoción y la colaboración en un <span class='text-[#00eefd]'>entorno virtual inmersivo.</span>
    <br><br>

    Únete a tus compañeros de equipo mientras resuelven desafiantes acertijos, superan obstáculos y trabajan juntos para lograr objetivos comunes.
    <br><br><br>

    <span class='text-[#00eefd]'>¡FORTALECE LOS LAZOS DE TU EQUIPO Y LLEVA SU POTENCIAL AL SIGUIENTE NIVEL EN ESTA EMOCIONANTE AVENTURA VIRTUAL!</span> 
  `,
  imagenUrl: 'assets/team-building-empresa.jpg',
    },
    {
      titulo: 'Activaciones Publicitarias',
      descripcion: `Haz que <span class='text-[#00eefd]'>tu marca cobre vida</span> de una manera totalmente nueva con nuestras <span class='text-[#00eefd]'>activaciones publicitarias</span> en realidad virtual. Transporta a tu audiencia a un mundo virtual cautivador donde podrán <span class='text-[#00eefd]'>interactuar con tu producto o servicio</span> de una manera envolvente.
      <br>
      Desde demostraciones interactivas hasta experiencias personalizadas, nuestra tecnología de vanguardia te ayudará a <span class='text-[#00eefd]'>conectar y cautivar a tu público</span>objetivo de una forma nunca antes vista.
      <br><br><br>
      <span class='text-[#00eefd]'>¡CREA UN IMPACTO DURADERO Y DEJA QUE TU MARCA SE DESTAQUE CON NUESTRAS ACTIVACIONES!</span> 
      `,
      imagenUrl: 'assets/activaciones-publicitarias.jpg',
    },
    {
      titulo: 'Eventos Corporativos',
      descripcion:`<span class='text-[#00eefd]'>Transforma tu evento corporativo</span> en una experiencia que <span class='text-[#00eefd]'>sorprenderá y cautivará</span> a todos tus invitados. Con nuestros servicios de Realidad Virtual, ofrecemos una amplia gama de actividades interactivas y emocionantes para que todos disfruten.
      <br>
      Desde simuladores de vuelo hasta <span class='text-[#00eefd]'>experiencias de realidad virtual envolventes</span>, garantizamos que cada asistente vivirá momentos únicos y memorables.
      <br><br><br>
      <span class='text-[#00eefd]'>¡DALE A TU EVENTO UN TOQUE INNOVADOR Y DEJA UNA IMPRESIÓN DURADERA EN TUS CLIENTES Y COLABORADORES!</span> 
      ` ,
      imagenUrl: 'assets/eventos-corporativos-empresa.jpg',
      },
  ];

  // Servicios para Personas
  private serviciosPersonas = [
    {
      titulo: 'Fiesta de Cumpleaños ',
      descripcion: `¿Quieres que <span class='text-[#00eefd]'>tu cumpleaños sea inolvidable</span> y lleno de diversión?
                    Con nuestras fiestas de cumpleaños VR, te transportaremos a <span class='text-[#00eefd]'>un mundo de ensueño</span> con experiencias de realidad virtual que sorprenderán y <span class='text-[#00eefd]'>emocionarán a todos</span> tus invitados.
                    <br>
                    Desde desafiantes juegos hasta emocionantes aventuras, ofrecemos una variedad de opciones para que todos puedan disfrutar de <span class='text-[#00eefd]'>UNA EXPERIENCIA ÚNICA Y PERSONALIZADA</span>.
        `,  
      imagenUrl: 'assets/fiesta-cumple.jpg',
    },
    {
      titulo: 'Uso Personal',
      descripcion: ` Sumérgete en un mundo virtual y <span class='text-[#00eefd]'>experimenta una realidad alternativa como nunca antes</span>.
                    <br>
                    Nuestro servicio de uso personal de realidad virtual te permite disfrutar <span class='text-[#00eefd]'>de emocionantes aventuras</span> y entretenimiento en la comodidad de <span class='text-[#00eefd]'>tu hogar.</span>
                    <br><br><br>
                    <span class='text-[#00eefd]'>PONEMOS A TU DISPOSICIÓN LOS EQUIPOS Y JUEGOS MÁS INNOVADORES PARA QUE VIVAS UNA EXPERIENCIA ÚNICA Y EMOCIONANTE.</span> `,
      imagenUrl: 'assets/uso-personal.jpg',
    },
    {
      titulo: 'Otras Celebraciones',
      descripcion: `Ya sea que estés celebrando un aniversario, un matrimonio o <span class='text-[#00eefd]'>cualquier otro evento especial</span>, nuestras celebraciones VR añaden un toque de emoción y novedad a tus reuniones.
      <br>

      Con nuestras atracciones de realidad virtual de última generación, <span class='text-[#00eefd]'>tus invitados podrán disfrutar de experiencias inmersivas</span> y divertidas que dejarán una impresión duradera.
<br><br><br>
    <span class='text-[#00eefd]'>¡HAZ DE TU EVENTO ALGO INOLVIDABLE CON NUESTRAS EMOCIONANTES OPCIONES DE REALIDAD VIRTUAL!</span> `,
      imagenUrl: 'assets/otras-celebraciones.jpg',
    },
  ];

  /**
   * Devuelve los servicios según el tipo (personas o empresas) almacenado en localStorage.
   */
  getServiciosPorTipo(): { titulo: string; descripcion: string; imagenUrl: string }[] {
    const tipoSeleccionado = localStorage.getItem('userSelection');

    if (tipoSeleccionado === 'Empresas') {
      return this.serviciosEmpresas;
    } else if (tipoSeleccionado === 'Personas') {
      return this.serviciosPersonas;
    }

    console.error('No se encontró una selección válida en localStorage.');
    return [];
  }
}
