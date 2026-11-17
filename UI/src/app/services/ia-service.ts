import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private readonly http = inject(HttpClient);
  private readonly backend = 'https://agent-sql.vercel.app/';

  enviarPrompt(query: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.backend}/response`,
      { prompt: query }
    );
  }

}
