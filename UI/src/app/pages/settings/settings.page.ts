import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonMenuButton,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/angular';
import { GoogleModel } from '../../models/google-model';
import { ConfiguracionService } from '../../services/configuracion-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonMenuButton,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar
  ]
})
export class SettingsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly configuracionService = inject(ConfiguracionService);

  readonly settingsForm = this.fb.nonNullable.group({
    apiKey: [''],
    model: ['', Validators.required]
  });

  models: GoogleModel[] = [];
  hasApiKey = false;
  cargando = false;
  guardando = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.configuracionService.getSettings().subscribe({
      next: (settings) => {
        this.hasApiKey = settings.has_api_key;
        this.settingsForm.controls.model.setValue(settings.model);
        this.updateApiKeyValidator();
        if (this.hasApiKey) {
          this.cargarModelos();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  cargarModelos(): void {
    const apiKey = this.settingsForm.controls.apiKey.value.trim();
    if (!apiKey && !this.hasApiKey) {
      this.settingsForm.controls.apiKey.markAsTouched();
      this.errorMessage = 'Escribe la API key de Google para consultar los modelos.';
      return;
    }

    this.cargando = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.configuracionService.getModels(apiKey).subscribe({
      next: (response) => {
        this.models = response.models;
        this.cargando = false;
        if (!this.models.some((model) => model.id === this.settingsForm.controls.model.value)) {
          this.settingsForm.controls.model.setValue('');
        }
        if (!this.models.length) {
          this.errorMessage = 'Google no devolvió modelos compatibles con generación de contenido.';
        }
      },
      error: (error: HttpErrorResponse) => {
        this.cargando = false;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  guardar(): void {
    if (this.settingsForm.invalid || (!this.hasApiKey && !this.settingsForm.controls.apiKey.value.trim())) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.configuracionService.saveSettings(
      this.settingsForm.controls.apiKey.value.trim(),
      this.settingsForm.controls.model.value
    ).subscribe({
      next: (settings) => {
        this.models = settings.models ?? this.models;
        this.hasApiKey = settings.has_api_key;
        this.settingsForm.controls.apiKey.setValue('');
        this.updateApiKeyValidator();
        this.guardando = false;
        this.successMessage = 'La configuración se aplicó correctamente.';
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private updateApiKeyValidator(): void {
    const apiKeyControl = this.settingsForm.controls.apiKey;
    apiKeyControl.setValidators(this.hasApiKey ? [] : [Validators.required]);
    apiKeyControl.updateValueAndValidity({ emitEvent: false });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const message = error.error?.error;
    return typeof message === 'string'
      ? message
      : 'No se pudo comunicar con el servidor de configuración.';
  }
}
