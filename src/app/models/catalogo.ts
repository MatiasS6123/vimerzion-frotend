export interface CatalogJuego {
    id?: string; // Opcional porque puede no estar disponible al crear un nuevo juego
    nombre: string; // Nombre del juego (obligatorio)
    descripcion: string; // Descripción del juego (obligatorio)
    plataformas: { nombre: string; imagenUrl: string }[];
    categoria:string // Lista de plataformas asociadas, cada una con su imagen
    activo?: boolean; // Opcional porque puede ser `true` por defecto si no se especifica
  }
  


  export interface FetchCatalogo {
    id?: string; // Incluye el ID del documento
    nombre: string; // Nombre del juego
    plataforma: { // Cambiar a un objeto en lugar de un array
      nombre: string;
      imagenUrl: string;
    };
    descripcion?: string; // Descripción del juego (opcional)
    categoria?: string; // Categoría del juego (opcional)
  }
  