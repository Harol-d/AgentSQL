import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Pokemon {
    id: number;
    name: string;
    type: string;
    level: number;
}
@Injectable()
export class PokemonService  {
    private url: string;
    public pokemons: Pokemon[] = [];

    constructor(private http: HttpClient) { 
        this.url = "https://pokeapi.co/api/v2/pokemon/"
    }
    // pokemon = this.pokemons.asReadonly();
    getPokemon(): Pokemon[] {
        return this.pokemons; 
    }
    addPokemon(pokemon: Pokemon): void {
        this.pokemons.push(pokemon);
    }
    
    

}
