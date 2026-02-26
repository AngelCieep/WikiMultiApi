import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { UniverseDetail } from './components/universes/universe-detail/universe-detail';
import { PersonajeDetail } from './components/personaje/personaje-detail/personaje-detail';
import { UniverseAdd } from './components/universes/universe-add/universe-add';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'universo/agregar', component: UniverseAdd },
  { path: 'universo/editar/:id', component: UniverseAdd },
  { path: 'universo/:id', component: UniverseDetail },
  { path: 'universo/:universeId/personaje/:id', component: PersonajeDetail },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
