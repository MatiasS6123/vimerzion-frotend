export interface Servicio {
    _id?: string;
    titulo: string;
    descripcion: string;
    fotos: { url: string,titulo:string,descripcion_foto?:string }[]; // Cambiar a un array de imágenes
    activo?: boolean;
    
  }
  
  