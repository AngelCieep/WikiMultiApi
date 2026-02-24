import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Universes } from './components/universes/universes';
import { AddUniverse } from './components/add-universe/add-universe';
import { UniverseDetail } from './components/universe-detail/universe-detail';
import { Characters } from './components/characters/characters';
import { CharacterDetail } from './components/character-detail/character-detail';
import { AllCharacters } from './components/all-characters/all-characters';
import { Documentation } from './components/documentation/documentation';
import { CharacterAdd } from './components/character-add/character-add';
import { UniverseEdit } from './components/universe-edit/universe-edit';
import { CharacterEdit } from './components/character-edit/character-edit';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'characters', component: AllCharacters },
    { path: 'character/:id', component: CharacterDetail },
    { path: 'character/:id/edit', component: CharacterEdit },
    { path: 'universes', component: Universes },
    { path: 'universes/new', component: AddUniverse },
    { path: 'universes/:slug', component: UniverseDetail },
    { path: 'universes/:slug/add-character', component: CharacterAdd },
    { path: 'universes/:slug/edit', component: UniverseEdit },
    { path: 'universes/:slug/characters', component: Characters },
    { path: 'universes/:slug/characters/:id', component: CharacterDetail },
    { path: 'documentation', component: Documentation },
    { path: '**', redirectTo: '' }
];
