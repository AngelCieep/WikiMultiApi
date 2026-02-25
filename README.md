# 📚 WikiMultiApi

**Multi-Universe Wiki Platform**  
Una plataforma tipo Wikipedia para gestionar y explorar múltiples universos ficticios (series, películas, videojuegos) y sus personajes mediante una arquitectura MEAN completa.

---

## 📋 Índice

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Problema que Resuelve](#-problema-que-resuelve)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Modelo de Datos](#-modelo-de-datos)
- [Reglas de Negocio](#-reglas-de-negocio)
- [Documentación de la API](#-documentación-de-la-api)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Despliegue](#-despliegue)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Autores](#-autores)

---

## 🎯 Descripción del Proyecto

**WikiMultiApi** es una plataforma full-stack que permite a los usuarios explorar y gestionar información detallada sobre universos ficticios y sus personajes. Similar a una enciclopedia interactiva, cada universo (Pokémon, Resident Evil, Star Wars, etc.) tiene su propia identidad visual personalizada con colores, tipografías y estilos únicos que se aplican dinámicamente en toda la interfaz.

El proyecto implementa:
- **Backend REST API** con Node.js, Express y MongoDB
- **Frontend Angular** con componentes standalone, signals y formularios reactivos
- **Frontend React** con hooks, React Router y gestión de estado
- **Diseño responsive** con Bootstrap 5
- **Operaciones CRUD completas** para universos y personajes
- **Sistema de búsqueda y filtrado** avanzado
- **Paginación** en listados de personajes
- **Tematización dinámica** por universo

---

## 🔍 Problema que Resuelve

En la actualidad, la información sobre universos ficticios está fragmentada entre múltiples wikis, foros y sitios web, cada uno con su propio diseño y estructura. **WikiMultiApi** centraliza esta información en una única plataforma que:

1. **Unifica múltiples universos** en un solo lugar con experiencia consistente
2. **Personaliza la experiencia visual** según el universo explorado
3. **Permite gestión colaborativa** mediante operaciones CRUD desde dos interfaces diferentes
4. **Ofrece búsqueda cross-universe** para encontrar personajes entre todos los universos
5. **Mantiene consistencia de datos** mediante una única API compartida

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** v20+ — Entorno de ejecución JavaScript
- **Express.js** — Framework web para Node.js
- **MongoDB** — Base de datos NoSQL
- **Mongoose** — ODM para MongoDB
- **CORS** — Manejo de políticas de origen cruzado

### Frontend Angular
- **Angular 19** — Framework con componentes standalone
- **Signals** — Gestión reactiva de estado
- **RxJS** — Programación reactiva
- **Bootstrap 5** — Framework CSS
- **Bootstrap Icons** — Iconografía
- **SweetAlert2** — Modales y alertas elegantes

### Frontend React
- **React 18** — Biblioteca de interfaces
- **React Router** — Navegación SPA
- **Vite** — Build tool y dev server
- **Fetch API** — Consumo de API REST
- **Bootstrap 5** — Framework CSS

### Herramientas de Desarrollo
- **Git/GitHub** — Control de versiones
- **Vercel** — Hosting y despliegue continuo
- **Postman** — Testing de API
- **VS Code** — Editor de código

---

## 📁 Arquitectura del Proyecto

```
WikiMultiApi/
│
├── backend/                      # API REST Node.js + Express
│   ├── controllers/              # Lógica de negocio
│   │   ├── characters.controller.js
│   │   └── univers.controller.js
│   ├── models/                   # Esquemas Mongoose
│   │   ├── characters.model.js
│   │   └── universe.model.js
│   ├── routes/                   # Definición de endpoints
│   │   ├── characters.route.js
│   │   └── universe.routes.js
│   ├── data/                     # Datos de ejemplo
│   ├── scripts/                  # Scripts de utilidad
│   ├── database.js               # Configuración MongoDB
│   ├── index.js                  # Punto de entrada
│   └── package.json
│
├── frontend-angular/             # Cliente Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # Componentes standalone
│   │   │   │   ├── home/
│   │   │   │   ├── universes/
│   │   │   │   ├── universe-detail/
│   │   │   │   ├── characters/
│   │   │   │   ├── character-detail/
│   │   │   │   ├── add-universe/
│   │   │   │   ├── universe-edit/
│   │   │   │   ├── character-add/
│   │   │   │   ├── character-edit/
│   │   │   │   ├── all-characters/
│   │   │   │   ├── documentation/
│   │   │   │   ├── navbar/
│   │   │   │   └── footer/
│   │   │   ├── interfaces/       # Tipos TypeScript
│   │   │   ├── services/         # ApiService
│   │   │   ├── pipes/            # SafeBg, SafeUrl
│   │   │   └── app.routes.ts     # Routing
│   │   └── styles.css            # Estilos globales
│   ├── angular.json
│   ├── vercel.json               # Config despliegue
│   └── package.json
│
└── frontend-react/               # Cliente React
    ├── src/
    │   ├── components/           # Componentes funcionales
    │   │   ├── homeBar/
    │   │   ├── wiiGame/
    │   │   ├── startPage/
    │   │   ├── charactersPage/
    │   │   └── characterDetail/
    │   ├── services/             # apiService
    │   ├── interfaces/           # Tipos TypeScript
    │   ├── assets/               # Recursos estáticos
    │   ├── App.tsx
    │   └── main.tsx
    ├── vite.config.ts
    └── package.json
```

---

## 🗃️ Modelo de Datos

### Colección: `universos`

```javascript
{
  _id: ObjectId,
  name: String,              // Nombre del universo (ej. "Pokémon")
  slug: String,              // URL-friendly (único, ej. "pokemon")
  description: String,       // Descripción general
  
  // Personalización visual
  logo: String,              // URL del logo
  backgroundImage: String,   // URL imagen de fondo
  imagenBoton: String,       // URL imagen para tarjetas
  fontFamily: String,        // Tipografía (ej. "Pokemon Solid")
  primaryColor: String,      // Color principal (hex)
  secondaryColor: String,    // Color secundario (hex)
  tertiaryColor: String,     // Color terciario (hex)
  textColor: String,         // Color de texto (hex)
  
  // Metadatos
  popularityScore: Number,   // 0-100
  releaseDate: Date,         // Fecha de lanzamiento
  isActive: Boolean,         // Estado activo/inactivo
  
  // Etiquetas personalizadas
  labels: {
    type: String,            // Ej. "Tipo Pokémon"
    abilities: String,       // Ej. "Habilidades"
    stats: String            // Ej. "Estadísticas"
  },
  
  // Mapeos de valores específicos del universo
  typeLabels: Map<String, String>,      // Ej. "fire" → "Fuego"
  statLabels: Map<String, String>,      // Ej. "hp" → "PS"
  abilityLabels: Map<String, String>,   // Ej. "blaze" → "Mar Llamas"
  
  createdAt: Date,
  updatedAt: Date
}
```

**Campos obligatorios del proyecto:**
- `popularityScore` (numérico)
- `releaseDate` (fecha)
- `isActive` (booleano)

### Colección: `personajes`

```javascript
{
  _id: ObjectId,
  name: String,              // Nombre del personaje
  title: String,             // Título/subtítulo (ej. "Pokémon Ratón")
  description: String,       // Descripción general
  
  // Secciones de contenido tipo wiki
  descriptionSections: [{
    sectionTitle: String,    // Ej. "Biología", "Historia"
    content: String          // Contenido extenso de la sección
  }],
  
  // Relación y recursos
  universeId: ObjectId,      // Referencia a universos
  image: String,             // URL imagen del personaje
  
  // Información adicional
  location: String,          // Ubicación/hábitat
  affiliation: String,       // Afiliación/grupo
  type: String,              // Tipo/categoría
  abilities: [String],       // Lista de habilidades
  stats: Map<String, Number>, // Estadísticas (ej. "hp": 45)
  
  // Campos obligatorios del proyecto
  numericField: Number,      // Campo numérico requerido
  dateField: Date,           // Campo fecha requerido
  booleanField: Boolean,     // Campo booleano requerido
  
  // Métricas
  views: Number,             // Contador de visualizaciones
  
  createdAt: Date,
  updatedAt: Date
}
```

**Relaciones:**
- Cada personaje pertenece a un universo (`universeId`)
- Un universo puede tener múltiples personajes

---

## ⚖️ Reglas de Negocio

### 1. **Slug Único en Universos**
- El campo `slug` en la colección `universos` debe ser único (índice MongoDB)
- Se utiliza para URLs amigables y búsquedas rápidas
- Validación automática a nivel de base de datos

### 2. **Validación de Popularity Score**
- El campo `popularityScore` debe estar en el rango **0-100**
- Validación en endpoint `PUT /universes/:id/popularity`
- Retorna error 400 si está fuera de rango

### 3. **Relación Obligatoria Universo-Personaje**
- Todo personaje debe tener un `universeId` válido
- El universo referenciado debe existir en la base de datos
- Permite filtrado de personajes por universo

### 4. **Contador de Vistas Automático**
- Cada consulta a `GET /characters/character/:id` incrementa el campo `views`
- Se utiliza para determinar el "personaje más visto"
- Valor por defecto: 0

### 5. **Personalización Visual por Universo**
- Los colores y tipografías del frontend se aplican dinámicamente según el universo activo
- Endpoint dedicado `GET /universes/style/:slug` retorna solo campos visuales
- Optimiza la carga de datos en componentes de detalle

### 6. **Paginación en Listados**
- Las consultas de personajes soportan paginación para mejorar rendimiento
- Implementado en componentes `all-characters` (Angular) y `charactersPage` (React)
- Reduce la carga inicial de datos

### 7. **Soft Delete con Confirmación**
- Las operaciones de eliminación requieren confirmación del usuario (SweetAlert2)
- Filtrado optimista: se oculta inmediatamente el elemento eliminado sin recargar página
- Uso de signals para reactividad instantánea

### 8. **Validaciones de Formularios**
- Frontend Angular: validaciones reactivas con `FormGroup` y mensajes de error en tiempo real
- Frontend React: validaciones controladas con estado local
- Backend: validaciones con Mongoose schema (required, trim, type)

---

## 📡 Documentación de la API

**Base URL:** `https://backend-wikiapi.vercel.app/api/v1`

### Documentación General

#### `GET /`
Retorna la documentación completa de la API con todos los endpoints disponibles.

**Respuesta:**
```json
{
  "nombre": "WikiMultiApi",
  "version": "1.0.0",
  "autores": ["Angel Mariblanca", "Francisco Vives"],
  "descripcion": "API REST para gestionar universos y personajes",
  "base_url": "/api/v1",
  "endpoints": { ... }
}
```

---

### Endpoints de Universos

#### `GET /universes`
Obtiene todos los universos con campos resumidos para cards.

**Respuesta:**
```json
{
  "status": [
    {
      "_id": "...",
      "name": "Pokémon",
      "slug": "pokemon",
      "logo": "https://...",
      "backgroundImage": "https://...",
      "imagenBoton": "https://...",
      "primaryColor": "#FFCB05",
      "secondaryColor": "#3D7DCA",
      "fontFamily": "Pokemon Solid",
      "isActive": true,
      "popularityScore": 100,
      "releaseDate": "1996-02-27T00:00:00.000Z"
    }
  ]
}
```

#### `GET /universes/:id`
Obtiene el detalle completo de un universo por ID.

**Parámetros:**
- `id` — ObjectId del universo

**Respuesta:**
```json
{
  "status": {
    "_id": "...",
    "name": "Pokémon",
    "slug": "pokemon",
    "description": "...",
    "logo": "...",
    "labels": {
      "type": "Tipo Pokémon",
      "abilities": "Habilidades",
      "stats": "Estadísticas"
    },
    "typeLabels": { "fire": "Fuego", ... },
    "statLabels": { "hp": "PS", ... },
    ...
  }
}
```

#### `GET /universes/style/:slug`
Obtiene solo los campos visuales de un universo por slug (optimizado para tematización).

**Parámetros:**
- `slug` — Slug del universo (ej. "pokemon")

**Respuesta:**
```json
{
  "status": {
    "_id": "...",
    "name": "Pokémon",
    "slug": "pokemon",
    "logo": "...",
    "backgroundImage": "...",
    "fontFamily": "Pokemon Solid",
    "primaryColor": "#FFCB05",
    "secondaryColor": "#3D7DCA",
    "tertiaryColor": "#FFD700",
    "textColor": "#2A2A2A",
    "isActive": true
  }
}
```

#### `POST /universes`
Crea un nuevo universo.

**Body:**
```json
{
  "name": "Dragon Ball",
  "slug": "dragon-ball",
  "description": "...",
  "popularityScore": 95,
  "releaseDate": "1986-11-20",
  "isActive": true,
  "primaryColor": "#FF8C00",
  "secondaryColor": "#FFD700",
  ...
}
```

**Respuesta:** `201 Created`

#### `PUT /universes/:id`
Actualiza un universo completo.

**Parámetros:**
- `id` — ObjectId del universo

**Body:** Objeto parcial o completo con campos a actualizar

**Respuesta:** `200 OK`

#### `PUT /universes/:id/popularity`
Actualiza solo el `popularityScore` de un universo.

**Parámetros:**
- `id` — ObjectId del universo

**Body:**
```json
{
  "popularityScore": 98
}
```

**Validación:** El valor debe estar entre 0 y 100.

**Respuesta:** `200 OK`

#### `DELETE /universes/:id`
Elimina un universo y todos sus personajes asociados.

**Parámetros:**
- `id` — ObjectId del universo

**Respuesta:** `200 OK`
```json
{
  "status": "Universo y personajes eliminados"
}
```

---

### Endpoints de Personajes

#### `GET /characters/all`
Obtiene todos los personajes con campos resumidos para listados.

**Respuesta:**
```json
{
  "status": [
    {
      "_id": "...",
      "name": "Pikachu",
      "title": "Pokémon Ratón",
      "image": "https://...",
      "universeId": "...",
      "booleanField": true,
      "views": 1234
    }
  ]
}
```

#### `GET /characters/character/:id`
Obtiene el detalle completo de un personaje e incrementa su contador de vistas.

**Parámetros:**
- `id` — ObjectId del personaje

**Respuesta:**
```json
{
  "status": {
    "_id": "...",
    "name": "Pikachu",
    "title": "Pokémon Ratón",
    "description": "...",
    "descriptionSections": [
      {
        "sectionTitle": "Biología",
        "content": "..."
      }
    ],
    "image": "...",
    "universeId": "...",
    "type": "electric",
    "abilities": ["static", "lightning-rod"],
    "stats": {
      "hp": 35,
      "attack": 55,
      ...
    },
    "views": 1235,
    ...
  }
}
```

**Efecto secundario:** Incrementa `views` en 1.

#### `GET /characters/top`
Obtiene el personaje con más vistas (personaje más popular).

**Respuesta:**
```json
{
  "status": {
    "_id": "...",
    "name": "Charizard",
    "views": 5432,
    ...
  }
}
```

#### `GET /characters/universe/:id`
Obtiene todos los personajes de un universo específico.

**Parámetros:**
- `id` — ObjectId del universo

**Respuesta:**
```json
{
  "status": [
    { "_id": "...", "name": "Pikachu", ... },
    { "_id": "...", "name": "Charizard", ... }
  ]
}
```

#### `POST /characters`
Crea un nuevo personaje.

**Body:**
```json
{
  "name": "Leon S. Kennedy",
  "title": "Agente Especial",
  "description": "...",
  "descriptionSections": [...],
  "universeId": "699e3659a45167bb385c0f09",
  "image": "https://...",
  "type": "stars",
  "abilities": ["firearms", "melee"],
  "stats": {
    "health": 90,
    "combat": 95,
    ...
  },
  "numericField": 1,
  "dateField": "1998-09-29T00:00:00.000Z",
  "booleanField": true
}
```

**Respuesta:** `201 Created`

#### `PUT /characters/:id`
Actualiza un personaje.

**Parámetros:**
- `id` — ObjectId del personaje

**Body:** Objeto parcial o completo con campos a actualizar

**Respuesta:** `200 OK`

#### `DELETE /characters/:id`
Elimina un personaje.

**Parámetros:**
- `id` — ObjectId del personaje

**Respuesta:** `200 OK`

---

### Códigos de Estado HTTP

- **200 OK** — Operación exitosa
- **201 Created** — Recurso creado exitosamente
- **400 Bad Request** — Error en los datos enviados o validación fallida
- **404 Not Found** — Recurso no encontrado
- **500 Internal Server Error** — Error del servidor

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js v20+
- MongoDB (local o Atlas)
- npm o yarn
- Git

### Backend

```bash
# Clonar el repositorio
git clone https://github.com/AngelCieep/WikiMultiApi.git
cd WikiMultiApi/backend

# Instalar dependencias
npm install

# Configurar variables de entorno (crear archivo .env)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/wikiapi
PORT=3000

# Ejecutar en desarrollo
npm run dev

# O en producción
npm start
```

La API estará disponible en `http://localhost:3000/api/v1`

### Frontend Angular

```bash
cd frontend-angular

# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve
# o
npm start

# Build de producción
ng build --configuration production
```

La aplicación estará disponible en `http://localhost:4200`

### Frontend React

```bash
cd frontend-react

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build de producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🌐 Despliegue

### URLs de Producción

- **API Backend:** [https://backend-wikiapi.vercel.app/api/v1](https://backend-wikiapi.vercel.app/api/v1)
- **Frontend Angular:** [https://wiki-multi-api.vercel.app](https://wiki-multi-api.vercel.app)
- **Frontend React:** [https://wiki-multi-api-react.vercel.app](https://wiki-multi-api-react.vercel.app)

### Plataformas de Hosting

- **Backend:** Vercel (Serverless Functions)
- **Frontend Angular:** Vercel
- **Frontend React:** Vercel
- **Base de Datos:** MongoDB Atlas

### Configuración de Despliegue

**Backend (`vercel.json`):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

**Frontend Angular (`vercel.json`):**
```json
{
  "buildCommand": "node node_modules/@angular/cli/bin/ng build --configuration production",
  "outputDirectory": "dist/frontend-angular/browser",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📸 Capturas de Pantalla

### Frontend Angular

#### Página de Inicio
![Home Page](docs/screenshots/angular-home.png)
_Slideshow de fondos con buscador universal y universos populares_

#### Listado de Universos
![Universes List](docs/screenshots/angular-universes.png)
_Grid de universos con búsqueda y filtrado, botones de eliminar en hover_

#### Detalle de Universo
![Universe Detail](docs/screenshots/angular-universe-detail.png)
_Página temática con información del universo y grid de personajes_

#### Detalle de Personaje
![Character Detail](docs/screenshots/angular-character-detail.png)
_Diseño tipo Wikipedia con imagen, secciones descriptivas y estadísticas_

#### Formulario de Creación
![Add Universe](docs/screenshots/angular-add-universe.png)
_Formulario reactivo con vista previa en tiempo real del diseño_

#### Listado de Personajes
![All Characters](docs/screenshots/angular-all-characters.png)
_Vista cross-universe con paginación y búsqueda_

### Frontend React

#### Menú Estilo Wii
![Wii Menu](docs/screenshots/react-wii-menu.png)
_Interfaz inspirada en el menú de Wii con canales de universos_

#### Página de Inicio de Universo
![Start Page](docs/screenshots/react-start-page.png)
_Vista de bienvenida temática con estadísticas_

#### Listado de Personajes
![Characters Grid](docs/screenshots/react-characters.png)
_Grid interactivo con tarjetas de personajes_

#### Detalle de Personaje
![Character Modal](docs/screenshots/react-character-detail.png)
_Modal con información completa y estadísticas visuales_

---

## 👥 Autores

- **Ángel Mariblanca** — Backend & Frontend Angular
- **Francisco Vives** — Frontend React & Diseño

---

## 📄 Licencia

Este proyecto fue desarrollado como Proyecto Final Integrador para el ciclo MEAN Stack (Angular + React).

---

## 🙏 Agradecimientos

- **Bootstrap** por el framework CSS
- **Pokémon API (PokeAPI)** por los datos de ejemplo
- **Resident Evil Fandom Wiki** por referencias visuales
- **Vercel** por el hosting gratuito
- **MongoDB Atlas** por la base de datos en la nube

---

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [Documentación de Angular](https://angular.dev/)
- [Documentación de React](https://react.dev/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)

---

**Última actualización:** Febrero 2026
