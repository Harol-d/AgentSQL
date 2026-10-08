import { Component } from '@angular/core';
import { CardPoke } from '../../components/card-poke/card-poke';
import { PokemonService } from '../../services/pokemon';

@Component({
  imports: [CardPoke],
  selector: 'app-pokemons-detail',
  styleUrl: './pokemons-detail.scss',
  templateUrl: './pokemons-detail.html',
})
export class PokemonsDetail {
  constructor() { }
  public pokemonService: PokemonService = new PokemonService();
  public pokemons = this.pokemonService.getPokemon();
}
