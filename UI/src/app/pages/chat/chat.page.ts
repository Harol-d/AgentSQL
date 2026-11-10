import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';
import { PromptComponent } from '../../componentes/prompt/prompt.component';
import { ContentQueryUserComponent } from '../../componentes/content-query-user/content-query-user.component';
import { ContentResponseModelComponent } from '../../componentes/content-response-model/content-response-model.component';
import { IaService } from '../../services/ia-service';
import { ArchivoService } from '../../services/archivo-service';
import { Archivo } from '../../models/archivo';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';
import { ApiResponse } from '../../models/apiResponse';

interface MensajeChat {
  id: number;
  consulta: string;
  respuesta: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, CommonModule, FormsModule, PromptComponent, ContentQueryUserComponent, ContentResponseModelComponent]
})
export class ChatPage {
  historial: MensajeChat[] = [];
  archivo: Archivo | null = null;
  subiendoArchivo = false;
  eliminandoArchivo = false;
  private siguienteIdMensaje = 0;


  constructor(
    private iaService: IaService,
    private archivoService: ArchivoService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  EnviarConsulta(query: string): Observable<ApiResponse> {
    const mensaje: MensajeChat = {
      id: this.siguienteIdMensaje++,
      consulta: query,
      respuesta: 'Generando respuesta...',
    };
    this.historial.push(mensaje);
    console.log('[ChatPage] Consulta recibida desde el prompt:', query);

    const respuesta$ = this.iaService.enviarPrompt(query).pipe(
      tap((respuesta) => {
        console.log('[ChatPage] Respuesta recibida del servicio:', respuesta);
        mensaje.respuesta = respuesta.LLM ?? respuesta.error ?? '';
        this.changeDetectorRef.detectChanges();
      }),
      catchError((error) => {
        console.error('No se pudo obtener la respuesta de la API:', error);
        mensaje.respuesta = 'No se pudo obtener una respuesta.';
        this.changeDetectorRef.detectChanges();
        return of({ error: mensaje.respuesta });
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    // El enlace de evento de la plantilla no se suscribe al Observable automáticamente.
    respuesta$.subscribe();
    return respuesta$;
  }

  alCambiarArchivo(archivo: Archivo | null): void {
    this.archivo = archivo;

    if (!archivo) {
      return;
    }

    this.subiendoArchivo = true;
    this.archivoService.subirArchivo(archivo).pipe(
      tap((respuesta) => {
        if (!respuesta.store_name) {
          throw new Error(respuesta.error ?? 'El servidor no devolvió el identificador del archivo.');
        }

        this.archivo = { ...archivo, fileStoreId: respuesta.store_name };
      }),
      catchError((error) => {
        console.error('No se pudo subir el archivo:', error);
        this.archivo = null;
        return EMPTY;
      }),
      finalize(() => {
        this.subiendoArchivo = false;
        this.changeDetectorRef.detectChanges();
      }),
    ).subscribe();
  }

  alEliminarArchivo(archivo: Archivo): void {
    if (!archivo.fileStoreId) {
      this.archivo = null;
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.eliminandoArchivo = true;
    this.archivoService.eliminarArchivo(archivo).pipe(
      tap(() => {
        this.archivo = null;
      }),
      catchError((error) => {
        console.error('Error al eliminar el archivo:', error);
        return EMPTY;
      }),
      finalize(() => {
        this.eliminandoArchivo = false;
        this.changeDetectorRef.detectChanges();
      }),
    ).subscribe();
  }
}
