import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonText } from '@ionic/angular';

@Component({
  selector: 'app-content-query-user',
  templateUrl: './content-query-user.component.html',
  styleUrls: ['./content-query-user.component.scss'],
  imports: [IonCard, IonCardContent, IonText],
})
export class ContentQueryUserComponent  implements OnInit {
  @Input() consulta: string = '';
  // @Input() time: number = 0;
  constructor() { }

  ngOnInit() {}

}
