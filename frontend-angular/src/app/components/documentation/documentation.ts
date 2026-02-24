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
  baseUrl = 'https://backend-wikiapi.vercel.app';

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
    "imagenBoton": "string",
    "primaryColor": "string",
    "secondaryColor": "string",
    "tertiaryColor": "string",
    "textColor": "string",
    "fontFamily": "string",
    "popularityScore": number,
    "releaseDate": "date",
    "isActive": boolean,
    "labels": { "type": "string", "abilities": "string", "stats": "string" },
    "typeLabels": {},
    "statLabels": {},
    "abilityLabels": {}
  }
}`
    },
    {
      method: 'GET',
      path: '/universes/style/:slug',
      description: 'Obtener los datos de estilo visual de un universo por slug',
      params: [{ name: 'slug', type: 'string', description: 'Slug único del universo' }],
      response: `{
  "status": {
    "_id": "string",
    "name": "string",
    "slug": "string",
    "logo": "string",
    "backgroundImage": "string",
    "imagenBoton": "string",
    "primaryColor": "string",
    "secondaryColor": "string",
    "tertiaryColor": "string",
    "textColor": "string",
    "fontFamily": "string",
    "labels": { "type": "string", "abilities": "string", "stats": "string" },
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
      method: 'POST',
      path: '/universes/bulk',
      description: 'Inserción masiva de universos',
      body: `[
  {
    "name": "string",
    "slug": "string",
    "description": "string",
    "logo": "string",
    "primaryColor": "string",
    "secondaryColor": "string",
    "popularityScore": number,
    "releaseDate": "date",
    "isActive": boolean
  }
]`,
      response: `{
  "status": [ /* universos creados */ ]
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
      method: 'GET',
      path: '/characters/universe/:iduniverse/character/:idcharacter',
      description: 'Obtener un personaje específico de un universo',
      params: [
        { name: 'iduniverse', type: 'string', description: 'ID del universo' },
        { name: 'idcharacter', type: 'string', description: 'ID del personaje' }
      ],
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
  "name": "string",           // requerido
  "title": "string",
  "description": "string",
  "descriptionSections": [
    { "sectionTitle": "string", "content": "string" }
  ],
  "image": "string",
  "universeId": "string",
  "location": "string",
  "affiliation": "string",
  "type": "string",
  "abilities": ["string"],
  "stats": { "clave": number },
  "numericField": number,     // requerido
  "dateField": "date",        // requerido
  "booleanField": boolean     // requerido
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
  {
    "name": "string",
    "universeId": "string",
    "numericField": number,
    "dateField": "date",
    "booleanField": boolean
  }
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
