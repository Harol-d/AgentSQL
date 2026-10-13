import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IaService {
  private readonly apiUrl = 'http://localhost:4000/response';

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
}
