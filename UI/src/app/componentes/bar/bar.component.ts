import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonLabel } from '@ionic/angular';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss'],
  imports: [IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonMenuToggle, IonItem, IonLabel, RouterLink],
})
export class BarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
