export interface CatalogJuego {
  id?: string; // Identificador opcional
  nombre: string; // Nombre del juego (obligatorio)
  descripcion: string; // Descripción del juego (obligatorio)
  plataformas: { nombre: string; imagenUrl: string }[]; // Lista de plataformas con imagen
  categoria: string; // Categoría del juego
  activo?: boolean; // Si el juego está activo
}


  
  export interface FetchCatalogo {
    _id: string;
    nombre: string;
    descripcion:string;
    plataforma:  { nombre: string; imagenUrl: string,videoUrl:string };
  }
  
  
  