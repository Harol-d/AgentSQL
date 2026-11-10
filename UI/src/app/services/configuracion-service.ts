import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleModel } from '../models/google-model';
import { LlmSettings } from '../models/llm-settings';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private readonly http = inject(HttpClient);
  private readonly backend = 'http://127.0.0.1:4000';

  getSettings(): Observable<LlmSettings> {
    return this.http.get<LlmSettings>(`${this.backend}/settings`);
  }

  getModels(apiKey: string): Observable<{ models: GoogleModel[] }> {
    return this.http.post<{ models: GoogleModel[] }>(
      `${this.backend}/settings/models`,
      { api_key: apiKey }
    );
  }

  saveSettings(apiKey: string, model: string): Observable<LlmSettings> {
    return this.http.post<LlmSettings>(
      `${this.backend}/settings`,
      { api_key: apiKey, model }
    );
  }
}
