import { Routes } from '@angular/router';
import { PokemonsDetail } from './pages/pokemons-detail/pokemons-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'agent', pathMatch: 'full' },
  { path: 'agent', component: PokemonsDetail }
];
