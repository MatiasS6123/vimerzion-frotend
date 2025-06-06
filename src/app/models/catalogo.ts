export interface CatalogJuego {
  id?: string; // Identificador opcional
  nombre: string; // Nombre del juego (obligatorio)
  descripcion: string; // Descripción del juego (obligatorio)
  plataformas: { nombre: string; imagenUrl: string,videoUrl:string }[]; // Lista de plataformas con imagen
  categoria: string; // Categoría del juego
  activo?: boolean; // Si el juego está activo
  hashtags?: string[]; // Lista de hashtags
  valoracion?: number; // Valoración del juego (opcional)
}


  
  export interface FetchCatalogo {
    _id: string;
    nombre: string;
    descripcion:string;
    plataforma:  { nombre: string; imagenUrl: string,videoUrl:string };
  }
  
  
  