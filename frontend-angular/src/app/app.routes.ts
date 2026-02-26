import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { UniverseDetail } from './components/universe-detail/universe-detail';
import { PersonajeDetail } from './components/personaje-detail/personaje-detail';

export const routes: Routes = [
  { path: '', component: Homepage },
  { path: 'universo/:id', component: UniverseDetail },
  { path: 'universo/:universeId/personaje/:id', component: PersonajeDetail },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
