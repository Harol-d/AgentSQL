import { Component, input } from '@angular/core';
// import { Pokemon, PokemonModel } from '../../services/pokemon';

@Component({
  imports: [],
  selector: 'app-card-poke',
  styleUrl: './card-poke.scss',
  templateUrl: './card-poke.html',
  standalone: true
})

export class CardPoke {
  title = input<string>('');
  // title: string;
  
  // constructor(title: string) {
  //   this.title = title;
  // }
}
