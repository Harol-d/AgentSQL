import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private readonly apiBaseUrl = 'https://agent-sql.vercel.app';
  private readonly apiUrl = `${this.apiBaseUrl}/response`;

  async enviarPrompt(prompt: string): Promise<string> {
    console.log('[IaService] Prompt que se envía:', prompt);

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    console.log('[IaService] Estado de la respuesta:', response.status);

    if (!response.ok) {
      throw new Error(`La API respondió con el estado ${response.status}`);
    }

    const data: { LLM?: string } = await response.json();
    console.log('[IaService] Respuesta recibida:', data);

    return data.LLM ?? '';
  }

  async subirArchivo(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const response = await fetch(`${this.apiBaseUrl}/subir`, {
      method: 'POST',
      body: formData
    });

    const data: { store_name?: string; error?: string } = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? `La API respondió con el estado ${response.status}`);
    }
    if (!data.store_name) {
      throw new Error('La API no devolvió el identificador del archivo indexado.');
    }

    return data.store_name;
  }

  async eliminarArchivo(storeName: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/files/delete-one`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ store_name: storeName })
    });

    const data: { error?: string } = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? `La API respondió con el estado ${response.status}`);
    }
  }
}
