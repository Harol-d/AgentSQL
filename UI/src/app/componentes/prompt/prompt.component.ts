import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonInput, IonButton, IonIcon, IonButtons, IonToolbar, IonFooter, IonChip, IonLabel } from '@ionic/angular';
import { IaService } from '../../services/ia-service';

interface ArchivoAdjunto {
  file: File;
  subiendo: boolean;
  storeName?: string;
  error?: string;
}

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  imports: [FormsModule, IonInput, IonButton, IonButtons, IonIcon, IonToolbar, IonFooter, IonChip, IonLabel],
})
export class PromptComponent implements OnInit {
  marcador: string = 'pregunta cualquier cosa';
  textoConsulta: string = '';
  archivosAdjuntos: ArchivoAdjunto[] = [];

  @Output() consultaEnviada = new EventEmitter<string>();
  @Output() archivosSeleccionados = new EventEmitter<File[]>();

  @ViewChild('selectorArchivo') selectorArchivo!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly actionSheetController: ActionSheetController,
    private readonly iaService: IaService
  ) { }

  async mostrarOpcionesArchivo() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Fotos y videos',
          icon: 'assets/fontawesome/solid/image.svg',
          handler: () => this.abrirSelectorArchivo('image/*,video/*'),
        },
        {
          text: 'Documentos',
          icon: 'assets/fontawesome/solid/file-lines.svg',
          handler: () => this.abrirSelectorArchivo('.pdf'),
        },
        {
          text: 'Cancelar',
          icon: 'assets/fontawesome/solid/xmark.svg',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  agregarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);

    if (archivos.length > 0) {
      const nuevosAdjuntos = archivos.map(file => ({ file, subiendo: true }));
      this.archivosAdjuntos = [...this.archivosAdjuntos, ...nuevosAdjuntos];
      this.emitirArchivosSeleccionados();
      nuevosAdjuntos.forEach(adjunto => void this.subirArchivo(adjunto));
      input.value = '';
    }
  }

  async quitarArchivo(indice: number): Promise<void> {
    const adjunto = this.archivosAdjuntos[indice];
    if (!adjunto || adjunto.subiendo) {
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Quitar archivo',
      // message: adjunto.storeName
      //   ? `Se eliminará ${adjunto.file.name} también del índice.`
      //   : `Se quitará ${adjunto.file.name} de la lista.`,
      buttons: [
        {
          text: 'Eliminar archivo',
          role: 'destructive',
          handler: () => void this.confirmarQuitarArchivo(adjunto),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  private abrirSelectorArchivo(tipo: string): void {
    const input = this.selectorArchivo.nativeElement;
    input.accept = tipo;
    input.click();
  }

  enviarConsulta(): void {
    const consulta = this.textoConsulta.trim();

    if (!consulta) {
      return;
    }

    this.consultaEnviada.emit(consulta);
    this.textoConsulta = '';
  }

  private async subirArchivo(adjunto: ArchivoAdjunto): Promise<void> {
    try {
      adjunto.storeName = await this.iaService.subirArchivo(adjunto.file);
    } catch (error) {
      adjunto.error = error instanceof Error ? error.message : 'No se pudo subir el archivo.';
    } finally {
      adjunto.subiendo = false;
    }
  }

  private async confirmarQuitarArchivo(adjunto: ArchivoAdjunto): Promise<void> {
    try {
      if (adjunto.storeName) {
        await this.iaService.eliminarArchivo(adjunto.storeName);
      }
      this.archivosAdjuntos = this.archivosAdjuntos.filter(item => item !== adjunto);
      this.emitirArchivosSeleccionados();
    } catch (error) {
      adjunto.error = error instanceof Error ? error.message : 'No se pudo eliminar el archivo.';
    }
  }

  private emitirArchivosSeleccionados(): void {
    this.archivosSeleccionados.emit(this.archivosAdjuntos.map(adjunto => adjunto.file));
  }

  ngOnInit() {}

}
