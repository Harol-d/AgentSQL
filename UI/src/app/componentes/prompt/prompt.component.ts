import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonButton, IonIcon, IonButtons, IonToolbar, IonFooter } from '@ionic/angular';


@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  imports: [FormsModule, IonInput, IonButton, IonButtons, IonIcon, IonToolbar, IonFooter],
})
export class PromptComponent implements OnInit {
  marcador: string = 'pregunta cualquier cosa';
  // icono: string = 'send';
  textoConsulta: string = '';

  @Output() consultaEnviada = new EventEmitter<string>();

  constructor() { }

  enviarConsulta(): void {
    const consulta = this.textoConsulta.trim();

    if (!consulta) {
      return;
    }

    this.consultaEnviada.emit(consulta);
    this.textoConsulta = '';
  }

  ngOnInit() {}

}
