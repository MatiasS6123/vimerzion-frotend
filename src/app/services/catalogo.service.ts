import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError, tap } from 'rxjs';

import { CatalogJuego, FetchCatalogo } from '../models/catalogo';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private API_URL =`${environment.apiUrl}/games`; // Cambiar a la URL de tu backend
  
  private http = inject(HttpClient);

  /**
   * Obtener todos los juegos paginados.
   * @returns Observable<CatalogJuego[]>
   */
  getAllPaginated(page: number, limit: number): Observable<{ games: CatalogJuego[]; total: number; page: number; pages: number }> {
    return this.http.get<{ games: CatalogJuego[]; total: number; page: number; pages: number }>(`${this.API_URL}?page=${page}&limit=${limit}`).pipe(
      catchError((error) => {
        console.error('Error al obtener los juegos paginados:', error);
        return throwError(() => new Error('No se pudieron obtener los juegos.'));
      })
    );
  }
  


getCatalogData(
  page: number,
  limit: number,
  platform: string | null
): Observable<{ games: FetchCatalogo[]; total: number; page: number; pages: number }> {
  const params = platform
    ? `?page=${page}&limit=${limit}&platform=${platform}`
    : `?page=${page}&limit=${limit}`;

  return this.http
    .get<{ games: FetchCatalogo[]; total: number; page: number; pages: number }>(
      `${this.API_URL}/catalog-data${params}`
    )
    .pipe(
      tap((response) => {
       /* console.log('✅ Datos recibidos del backend:');
        console.log('Games:', response.games);
        console.log('Total:', response.total);
        console.log('Page:', response.page);
        console.log('Pages:', response.pages);*/
      }),
      catchError((error) => {
        console.error('❌ Error al obtener el catálogo de juegos:', error);
        return throwError(() => new Error('No se pudo obtener el catálogo de juegos.'));
      })
    );
}


  /**
   * Buscar un juego por nombre.
   * @param nombre Nombre del juego.
   * @returns Observable<CatalogJuego>
   */
  getGameByName(nombre: string): Observable<{games:FetchCatalogo[]}> {
    return this.http.get<{games:FetchCatalogo[]}>(`${this.API_URL}/platform/${nombre}`).pipe(
      catchError((error) => {
        console.error('Error al buscar el juego por nombre:', error);
        return throwError(() => new Error('No se pudo encontrar el juego.'));
      })
    );
  }

  /**
   * Crear un nuevo juego en el catálogo.
   * @param juego Datos del juego en formato CatalogJuego.
   * @param plataformas Array de plataformas con nombre e imagen.
   * @returns Observable<CatalogJuego>
   */
// catalogo.service.ts
createCatalogoJuego(
  juego: Omit<CatalogJuego, 'id'>,
  plataformas: { nombre: string; imagen: File; videoUrl: string }[]
): Observable<CatalogJuego> {
  const formData = new FormData();

  // Agregar datos básicos
  formData.append('nombre', juego.nombre);
  formData.append('descripcion', juego.descripcion);
  formData.append('categoria', juego.categoria);
  formData.append('activo', juego.activo?.toString() || 'true');

  // Agregar hashtags como JSON string
  if (Array.isArray(juego.hashtags)) {
    juego.hashtags.forEach(tag => formData.append('hashtags[]', tag));
  }

  // Agregar valoracion si viene definida
  if (typeof juego.valoracion === 'number') {
    formData.append('valoracion', juego.valoracion.toString());
  }

  // Agregar plataformas sin la imagen (se incluye aparte)
  const plataformasData = plataformas.map(p => ({
    nombre: p.nombre,
    videoUrl: p.videoUrl
  }));
  formData.append('plataformas', JSON.stringify(plataformasData));

  // Agregar los archivos de imagen por plataforma
  plataformas.forEach((plataforma) => {
    const nombreFormateado = `imagen_${plataforma.nombre.toLowerCase().replace(/\s+/g, '_')}`;
    formData.append(nombreFormateado, plataforma.imagen);
  });

  return this.http.post<CatalogJuego>(`${this.API_URL}`, formData).pipe(
    catchError((error) => {
      console.error('Error al crear el juego en el catálogo:', error);
      return throwError(() => new Error('No se pudo crear el juego.'));
    })
  );
}

  /**
   * Actualizar un juego existente en el catálogo.
   * @param id ID del juego.
   * @param juego Datos del juego en formato CatalogJuego.
   * @param plataformas Array de plataformas con nombre e imagen.
   * @returns Observable<CatalogJuego>
   */
  updateCatalogoJuego(
    id: string,
    juego: Partial<CatalogJuego>,
    plataformas: { nombre: string; imagen: File | null; videoUrl: string }[]
  ): Observable<CatalogJuego> {
    const formData = new FormData();
  
    // Agregar datos básicos si existen
    if (juego.nombre) formData.append('nombre', juego.nombre);
    if (juego.descripcion) formData.append('descripcion', juego.descripcion);
    if (juego.categoria) formData.append('categoria', juego.categoria);
    if (juego.activo !== undefined) formData.append('activo', String(juego.activo));
  
    // Agregar hashtags si existen
    if (Array.isArray(juego.hashtags)) {
      juego.hashtags.forEach(tag => formData.append('hashtags[]', tag));
    }
  
    // Agregar valoración si está definida
    if (typeof juego.valoracion === 'number') {
      formData.append('valoracion', juego.valoracion.toString());
    }
  
    // Agregar plataformas (sin imagen aquí)
    const plataformasData = plataformas.map(p => ({
      nombre: p.nombre,
      videoUrl: p.videoUrl
    }));
    formData.append('plataformas', JSON.stringify(plataformasData));
  
    // Agregar imágenes si existen
    plataformas.forEach((plataforma) => {
      if (plataforma.imagen) {
        const nombreFormateado = `imagen_${plataforma.nombre.toLowerCase().replace(/\s+/g, "_")}`;
        formData.append(nombreFormateado, plataforma.imagen);
      }
    });
  
    return this.http.put<CatalogJuego>(`${this.API_URL}/${id}`, formData).pipe(
      catchError((error) => {
        console.error('Error al actualizar el juego en el catálogo:', error);
        return throwError(() => new Error('No se pudo actualizar el juego.'));
      })
    );
  }
  
  /*faltaacutalizar ahora estan los campos hastagas y valoracion*/
  
  
  /**
   * Buscar un juego por su ID.
   * @param id ID del juego.
   * @returns Observable<CatalogJuego>
   */
  findById(id: string): Observable<CatalogJuego> {
    return this.http.get<CatalogJuego>(`${this.API_URL}/id/${id}`).pipe(
      catchError((error) => {
        console.error('Error al buscar el juego por ID:', error);
        return throwError(() => new Error('No se pudo encontrar el juego.'));
      })
    );
  }

  /**
   * Desactivar un juego (soft delete).
   * @param id ID del juego.
   * @returns Observable<{ message: string }>
   */
  deactivateJuego(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al desactivar el juego:', error);
        return throwError(() => new Error('No se pudo desactivar el juego.'));
      })
    );
  }
}
