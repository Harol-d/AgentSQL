import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonInput, IonButton, IonIcon, IonButtons, IonToolbar, IonFooter, IonChip, IonLabel } from '@ionic/angular';
import { Archivo } from '../../models/archivo';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  imports: [FormsModule, IonInput, IonButton, IonButtons, IonIcon, IonToolbar, IonFooter, IonChip, IonLabel],
})
export class PromptComponent {
  marcador = 'pregunta cualquier cosa';
  Query: string = '';

  @Input() archivo: Archivo | null = null;
  @Input() subiendoArchivo = false;
  @Input() eliminandoArchivo = false;
  @Output() consultaEnviada = new EventEmitter<string>();
  @Output() archivoSeleccionado = new EventEmitter<Archivo | null>();
  @Output() archivoEliminarSolicitado = new EventEmitter<Archivo>();

  @ViewChild('selectorArchivo') selectorArchivo!: ElementRef<HTMLInputElement>;

  constructor(private readonly actionSheetController: ActionSheetController) { }

  async mostrarOpcionesArchivo(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Fotos y videos',
          icon: 'image-outline',
          handler: () => this.abrirSelectorArchivo('image/*,video/*'),
        },
        {
          text: 'Documentos',
          icon: 'document-text-outline',
          handler: () => this.abrirSelectorArchivo('.pdf'),
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  agregarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const extensionIndex = file.name.lastIndexOf('.');
      this.archivo = {
        file,
        nombre: file.name,
        extension: extensionIndex >= 0 ? file.name.slice(extensionIndex + 1).toLowerCase() : '',
        tamaño: file.size,
        fileStoreId: '',
      };
      this.archivoSeleccionado.emit(this.archivo);
    }

    input.value = '';
  }

  async quitarArchivo(): Promise<void> {
    if (!this.archivo) {
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Quitar archivo',
      buttons: [
        {
          text: 'Eliminar archivo',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => void this.confirmarQuitarArchivo(),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  enviarConsulta(): void {
    const consulta = this.Query.trim();
    if (this.subiendoArchivo || this.eliminandoArchivo || !consulta) {
      return;
    }

    this.consultaEnviada.emit(consulta);
    this.Query = '';
  }

  private abrirSelectorArchivo(tipo: string): void {
    const input = this.selectorArchivo.nativeElement;
    input.accept = tipo;
    input.click();
  }

  private async confirmarQuitarArchivo(): Promise<void> {
    if (!this.archivo) {
      return;
    }

    this.archivoEliminarSolicitado.emit(this.archivo);
  }
}
