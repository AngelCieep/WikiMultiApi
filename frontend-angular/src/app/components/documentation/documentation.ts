import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
  body?: string;
  response?: string;
}

@Component({
  selector: 'app-documentation',
  imports: [CommonModule],
  templateUrl: './documentation.html',
  styleUrl: './documentation.css',
})
export class Documentation {
  baseUrl = 'http://localhost:3000/api/v1';

  universeEndpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/universes',
      description: 'Obtener todos los universos',
      response: `{
  "status": [
    {
      "_id": "string",
      "name": "string",
      "slug": "string",
      "logo": "string",
      "primaryColor": "string",
      "secondaryColor": "string",
      "popularityScore": number,
      "isActive": boolean
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/universes/:id',
      description: 'Obtener un universo por ID',
      params: [{ name: 'id', type: 'string', description: 'ID del universo' }],
      response: `{
  "status": {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "logo": "string",
    "backgroundImage": "string",
    "primaryColor": "string",
    "secondaryColor": "string",
    "fontFamily": "string",
    "popularityScore": number,
    "releaseDate": "date",
    "isActive": boolean,
    "labels": {},
    "typeLabels": {},
    "statLabels": {},
    "abilityLabels": {}
  }
}`
    },
    {
      method: 'POST',
      path: '/universes',
      description: 'Crear un nuevo universo',
      body: `{
  "name": "string",
  "slug": "string",
  "description": "string",
  "logo": "string",
  "primaryColor": "string",
  "secondaryColor": "string",
  "popularityScore": number,
  "releaseDate": "date",
  "isActive": boolean
}`,
      response: `{
  "status": { /* universo creado */ }
}`
    },
    {
      method: 'PUT',
      path: '/universes/:id',
      description: 'Actualizar un universo',
      params: [{ name: 'id', type: 'string', description: 'ID del universo' }],
      body: `{ /* campos a actualizar */ }`,
      response: `{
  "status": { /* universo actualizado */ }
}`
    },
    {
      method: 'DELETE',
      path: '/universes/:id',
      description: 'Eliminar un universo',
      params: [{ name: 'id', type: 'string', description: 'ID del universo' }],
      response: `{
  "status": "Universo eliminado"
}`
    }
  ];

  characterEndpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/characters/all',
      description: 'Obtener todos los personajes',
      response: `{
  "status": [
    {
      "_id": "string",
      "name": "string",
      "title": "string",
      "image": "string",
      "universeId": "string",
      "booleanField": boolean
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/characters/character/:id',
      description: 'Obtener un personaje por ID',
      params: [{ name: 'id', type: 'string', description: 'ID del personaje' }],
      response: `{
  "status": {
    "_id": "string",
    "name": "string",
    "title": "string",
    "description": "string",
    "descriptionSections": [],
    "image": "string",
    "universeId": "string",
    "location": "string",
    "affiliation": "string",
    "type": "string",
    "abilities": [],
    "stats": {},
    "numericField": number,
    "dateField": "date",
    "booleanField": boolean
  }
}`
    },
    {
      method: 'POST',
      path: '/characters/universe/:id',
      description: 'Obtener personajes por universo',
      params: [{ name: 'id', type: 'string', description: 'ID del universo' }],
      response: `{
  "status": [ /* array de personajes */ ]
}`
    },
    {
      method: 'POST',
      path: '/characters',
      description: 'Crear un nuevo personaje',
      body: `{
  "name": "string",
  "title": "string",
  "description": "string",
  "image": "string",
  "universeId": "string",
  "numericField": number,
  "dateField": "date",
  "booleanField": boolean
}`,
      response: `{
  "status": { /* personaje creado */ }
}`
    },
    {
      method: 'POST',
      path: '/characters/bulk',
      description: 'Inserción masiva de personajes',
      body: `[
  { /* personaje 1 */ },
  { /* personaje 2 */ }
]`,
      response: `{
  "inserted": number,
  "status": [ /* personajes creados */ ]
}`
    },
    {
      method: 'PUT',
      path: '/characters/:id',
      description: 'Actualizar un personaje',
      params: [{ name: 'id', type: 'string', description: 'ID del personaje' }],
      body: `{ /* campos a actualizar */ }`,
      response: `{
  "status": { /* personaje actualizado */ }
}`
    },
    {
      method: 'DELETE',
      path: '/characters/:id',
      description: 'Eliminar un personaje',
      params: [{ name: 'id', type: 'string', description: 'ID del personaje' }],
      response: `{
  "status": "Personaje eliminado"
}`
    }
  ];
}
