import { Component, Input, OnInit, Output} from '@angular/core';
import { IonCard, IonCardContent, IonText } from '@ionic/angular';

@Component({
  selector: 'app-content-response-model',
  templateUrl: './content-response-model.component.html',
  styleUrls: ['./content-response-model.component.scss'],
  imports: [IonCard, IonCardContent, IonText],
})
export class ContentResponseModelComponent  implements OnInit {
  @Input() responseModel: string = '';
  // @Output () query: string = '';
  constructor() {
  }

  ngOnInit() {}
}
