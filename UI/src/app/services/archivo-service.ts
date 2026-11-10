import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { Archivo } from '../models/archivo';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  private readonly http = inject(HttpClient);
  private readonly backend = 'http://127.0.0.1:4000';

  subirArchivo(archivo: Archivo): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', archivo.file, archivo.nombre);
    return this.http.post<ApiResponse>(`${this.backend}/subir`, formData);
  }

  eliminarArchivo(archivo: Archivo): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.backend}/files/delete-one`, {
      body: { store_name: archivo.fileStoreId }
    });
  }
}
