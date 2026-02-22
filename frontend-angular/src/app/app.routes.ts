import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Universes } from './components/universes/universes';
import { UniverseDetail } from './components/universe-detail/universe-detail';
import { Characters } from './components/characters/characters';
import { CharacterDetail } from './components/character-detail/character-detail';
import { Documentation } from './components/documentation/documentation';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'universes', component: Universes },
    { path: 'universes/:slug', component: UniverseDetail },
    { path: 'universes/:slug/characters', component: Characters },
    { path: 'universes/:slug/characters/:id', component: CharacterDetail },
    { path: 'documentation', component: Documentation },
    { path: '**', redirectTo: '' }
];
