import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';
import { BarComponent } from '../../componentes/bar/bar.component';
import { PromptComponent } from '../../componentes/prompt/prompt.component';
import { ContentQueryUserComponent } from '../../componentes/content-query-user/content-query-user.component';
import { ContentResponseModelComponent } from '../../componentes/content-response-model/content-response-model.component';
import { IaService } from '../../services/ia-service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, CommonModule, FormsModule, PromptComponent, BarComponent, ContentQueryUserComponent, ContentResponseModelComponent]
})
export class ChatPage implements OnInit {

  consultaUsuario: string = '';
  respuestaModelo: string = '';

  constructor(
    private iaService: IaService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  async alEnviarConsulta(consulta: string): Promise<void> {
    this.consultaUsuario = consulta;
    console.log('[ChatPage] Consulta recibida desde el prompt:', consulta);

    try {
      this.respuestaModelo = await this.iaService.enviarPrompt(consulta);
      console.log('[ChatPage] Respuesta recibida del servicio:', this.respuestaModelo);
      this.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error('No se pudo obtener la respuesta de la API:', error);
      this.respuestaModelo = 'No se pudo obtener una respuesta.';
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
  }

}
