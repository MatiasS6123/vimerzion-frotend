import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Servicio } from '../models/servicios';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private API_URL = `${environment.apiUrl}/service`; // URL base de la API
  private http = inject(HttpClient); // Inyección del HttpClient

  /**
   * Obtener todos los servicios.
   * @returns Observable<Servicio[]>
   */
  getAllServicios(page: number, limit: number): Observable<{ servicios: Servicio[]; total: number; page: number; pages: number }> {
    return this.http.get<{ servicios: Servicio[]; total: number; page: number; pages: number }>(
      `${this.API_URL}?page=${page}&limit=${limit}`
    ).pipe(
      catchError((error) => {
        console.error('Error al obtener los servicios:', error);
        return throwError(() => new Error('No se pudieron obtener los servicios.'));
      })
    );
  }
  

  /**
   * Buscar un servicio por su nombre.
   * @param nombre Nombre del servicio.
   * @returns Observable<Servicio>
   */
  getServiciosByName(titulo: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.API_URL}/nombre/${titulo}`).pipe(
      catchError((error) => {
        console.error('Error al buscar el servicio por nombre:', error);
        return throwError(() => new Error('No se pudo encontrar el servicio.'));
      })
    );
  }

  /**
   * Crear un nuevo servicio.
   * @param nombre Nombre del servicio.
   * @param descripcion Descripción del servicio.
   * @param imagenes Archivos de imágenes del servicio.
   * @returns Observable<Servicio>
   */
  createServicio(servicio: Servicio, imagenes: File[]): Observable<Servicio> {
    const formData = new FormData();
    formData.append('titulo', servicio.titulo);
    formData.append('descripcion', servicio.descripcion);
    formData.append('activo', servicio.activo ? 'true' : 'false');

    // Incluir fotos existentes con títulos y descripciones
    if (servicio.fotos && servicio.fotos.length > 0) {
        formData.append(
            'fotos',
            JSON.stringify(
                servicio.fotos.map((foto) => ({
                    url: foto.url,
                    titulo: foto.titulo || 'Sin título',
                    descripcion_foto: foto.descripcion_foto || 'Sin descripción',
                }))
            )
        );
    }

    // Agregar nuevas imágenes con sus títulos y descripciones
    imagenes.forEach((imagen, index) => {
        formData.append('imagen', imagen); // Archivos de imagen
        formData.append(
            `titulos[${index}]`,
            JSON.stringify({
                titulo: servicio.fotos?.[index]?.titulo || `Nueva Imagen ${index + 1}`,
                descripcion_foto:
                    servicio.fotos?.[index]?.descripcion_foto || `Descripción de la Imagen ${index + 1}`,
            })
        );
    });

    return this.http.post<Servicio>(`${this.API_URL}`, formData).pipe(
        catchError((error) => {
            console.error('Error al crear el servicio:', error);
            return throwError(() => new Error('No se pudo crear el servicio.'));
        })
    );
}


  

  /**
   * Actualizar un servicio existente.
   * @param id ID del servicio a actualizar.
   * @param nombre Nombre del servicio (opcional).
   * @param descripcion Descripción del servicio (opcional).
   * @param imagenes Archivos de imágenes del servicio (opcional).
   * @returns Observable<Servicio>
   */
  updateServicio(id: string, servicio: Servicio, imagenes?: File[]): Observable<Servicio> {
    const formData = new FormData();
    formData.append('titulo', servicio.titulo);
    formData.append('descripcion', servicio.descripcion);
    formData.append('activo', servicio.activo ? 'true' : 'false');

    // Incluir fotos existentes con títulos y descripciones
    if (servicio.fotos && servicio.fotos.length > 0) {
        formData.append(
            'fotos',
            JSON.stringify(
                servicio.fotos.map((foto) => ({
                    url: foto.url,
                    titulo: foto.titulo || 'Sin título',
                    descripcion_foto: foto.descripcion_foto || 'Sin descripción',
                }))
            )
        );
    }

    // Manejar nuevas imágenes y sus detalles
    if (imagenes) {
        const nuevosDetalles = imagenes.map((imagen, index) => {
            return {
                titulo: servicio.fotos?.[index]?.titulo || `Nueva Imagen ${index + 1}`,
                descripcion_foto:
                    servicio.fotos?.[index]?.descripcion_foto || `Descripción de la Imagen ${index + 1}`,
            };
        });

        imagenes.forEach((imagen) => {
            formData.append('imagen', imagen); // Archivos de imagen
        });

        formData.append('nuevasFotosDetalles', JSON.stringify(nuevosDetalles));
    }

    return this.http.put<Servicio>(`${this.API_URL}/${id}`, formData).pipe(
        catchError((error) => {
            console.error('Error al actualizar el servicio:', error);
            return throwError(() => new Error('No se pudo actualizar el servicio.'));
        })
    );
}





  

  /**
   * Buscar un servicio por su ID.
   * @param id ID del servicio a buscar.
   * @returns Observable<Servicio>
   */
  findById(id: string): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.API_URL}/id/${id}`).pipe(
      catchError((error) => {
        console.error('Error al buscar el servicio por ID:', error);
        return throwError(() => new Error('No se pudo encontrar el servicio.'));
      })
    );
  }

  /**
   * Desactivar un servicio (soft delete).
   * @param id ID del servicio a desactivar.
   * @returns Observable<{ message: string }>
   */
  deactivateServicio(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al desactivar el servicio:', error);
        return throwError(() => new Error('No se pudo desactivar el servicio.'));
      })
    );
  }
}
