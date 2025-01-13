export interface Tecnologia {
    id?: string;
    nombre: string;
    descripcion: string;
    imagen: { url: string }; // Solo la URL de la imagen se almacena
    activo?: boolean;
}

  
  
  