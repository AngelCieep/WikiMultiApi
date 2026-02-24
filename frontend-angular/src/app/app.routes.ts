import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Universes } from './components/universes/universes';
import { AddUniverse } from './components/add-universe/add-universe';
import { UniverseDetail } from './components/universe-detail/universe-detail';
import { Characters } from './components/characters/characters';
import { CharacterDetail } from './components/character-detail/character-detail';
import { AllCharacters } from './components/all-characters/all-characters';
import { Documentation } from './components/documentation/documentation';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'characters', component: AllCharacters },
    { path: 'character/:id', component: CharacterDetail },
    { path: 'universes', component: Universes },
    { path: 'universes/new', component: AddUniverse },
    { path: 'universes/:slug', component: UniverseDetail },
    { path: 'universes/:slug/characters', component: Characters },
    { path: 'universes/:slug/characters/:id', component: CharacterDetail },
    { path: 'documentation', component: Documentation },
    { path: '**', redirectTo: '' }
];
