# 📚 WikiMultiApi

**Multi-Universe Wiki Platform**  
Plataforma full-stack tipo Wikipedia para gestionar y explorar múltiples universos ficticios y sus personajes, con tematización dinámica por universo.

---

## 📋 Índice

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [API REST](#-api-rest)
- [Instalación](#-instalación)
- [Despliegue](#-despliegue)

---

## 📖 Descripción

**WikiMultiApi** centraliza información sobre universos ficticios (Pokémon, Resident Evil, etc.) y sus personajes en una única plataforma. Cada universo aplica su propia identidad visual (colores, tipografías, fondos) dinámicamente en toda la interfaz.

**Características principales:**
- **CRUD completo** para universos y personajes
- **Tematización dinámica** según el universo activo
- **Sistema de búsqueda** cross-universe con signals
- **Paginación** y filtros avanzados
- **Formularios reactivos** con validaciones en tiempo real
- **Documentación interactiva** de la API integrada

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express.js** — API REST
- **MongoDB** + **Mongoose** — Base de datos NoSQL
- **CORS** — Políticas de origen cruzado

### Frontend Angular
- **Angular 19** — Standalone components
- **Signals** — Gestión reactiva de estado
- **Reactive Forms** — FormBuilder con validaciones
- **Bootstrap 5** + **Bootstrap Icons** — UI/UX

### Frontend React
- **React 18** + **React Router** — SPA con navegación
- **Vite** — Build tool y dev server
- **Bootstrap 5** — Framework CSS

---

## 📁 Arquitectura

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
│   ├── routes/                   # Endpoints
│   │   ├── characters.route.js
│   │   └── universe.routes.js
│   ├── database.js               # Conexión MongoDB
│   └── index.js                  # Entry point
│
├── frontend-angular/             # Cliente Angular 19
│   └── src/app/
│       ├── components/
│       │   ├── homepage/         # Listado y filtros
│       │   ├── navbar/           # Navegación + búsqueda
│       │   ├── footer/           # Footer
│       │   ├── doc/              # Documentación API
│       │   ├── personaje/        
│       │   │   ├── personaje-add/      # Crear/editar personaje
│       │   │   └── personaje-detail/   # Detalle personaje
│       │   └── universes/
│       │       ├── universe-add/       # Crear/editar universo
│       │       └── universe-detail/    # Detalle + personajes
│       ├── common/
│       │   └── interfaces.ts     # TypeScript types
│       ├── service/
│       │   ├── api.service.ts    # HTTP service
│       │   └── search.service.ts # Signal-based search
│       └── app.routes.ts         # Routing
│
└── frontend-react/               # Cliente React 18
    └── src/
        ├── componentes/          # Componentes funcionales
        │   ├── HomePage.tsx
        │   ├── Navbar.tsx
        │   ├── PersonajeCard.tsx
        │   ├── PersonajeDetail.tsx
        │   ├── UniversoCard.tsx
        │   └── UniversoDetail.tsx
        └── types/                # TypeScript interfaces
```

---

## 🗃️ Modelo de Datos

### Colección: `universos`

```javascript
{
  _id: ObjectId,
  name: String,              // Nombre del universo
  slug: String,              // URL-friendly (único)
  description: String,
  
  // Personalización visual
  logo: String,
  backgroundImage: String,
  imagenBoton: String,
  fontFamily: String,
  primaryColor: String,
  secondaryColor: String,
  tertiaryColor: String,
  textColor: String,
  
  // Campos requeridos del proyecto
  popularityScore: Number,   // 0-100
  releaseDate: Date,
  isActive: Boolean,
  
  // Etiquetas personalizadas
  labels: { type, abilities, stats },
  typeLabels: Map<String, String>,
  statLabels: Map<String, String>,
  abilityLabels: Map<String, String>
}
```

### Colección: `personajes`

```javascript
{
  _id: ObjectId,
  name: String,
  title: String,
  description: String,
  
  // Contenido
  descriptionSections: [{
    sectionTitle: String,
    content: String
  }],
  
  // Relación
  universeId: ObjectId,      // Referencia a universos
  image: String,
  
  // Datos adicionales
  location: String,
  affiliation: String,
  type: String,
  abilities: [String],
  stats: Map<String, Number>,
  
  // Campos requeridos del proyecto
  numericField: Number,
  dateField: Date,
  booleanField: Boolean,
  
  // Métricas
  views: Number             // Contador automático
}
```

**Relaciones:**
- `personajes.universeId` → `universos._id` (cada personaje pertenece a un universo)
- Un universo puede tener múltiples personajes

---

## 📡 API REST

**Base URL:** `https://backend-wikiapi.vercel.app/api/v1`

### Endpoints principales

**Universos:**
- `GET /universes` — Listar todos
- `GET /universes/:id` — Detalle completo
- `GET /universes/style/:slug` — Solo campos visuales (optimizado)
- `GET /universes/filtered` — Con filtros y ordenación
- `POST /universes/search` — Búsqueda por nombre
- `POST /universes` — Crear
- `PUT /universes/:id` — Actualizar
- `PUT /universes/:id/popularity` — Actualizar popularidad (0-100)
- `DELETE /universes/:id` — Eliminar (+ personajes asociados)

**Personajes:**
- `GET /characters/all` — Listar todos
- `GET /characters/character/:id` — Detalle (incrementa vistas)
- `GET /characters/top` — Personaje más visto
- `GET /characters/filtered` — Con filtros y ordenación
- `POST /characters/byUniverse` — Por universo específico
- `POST /characters` — Crear
- `PUT /characters/:id` — Actualizar
- `DELETE /characters/:id` — Eliminar

**Documentación completa:** Disponible en el componente `/doc` del frontend Angular con ejemplos de request/response para Postman.

---

## 🚀 Instalación

### Prerrequisitos
- Node.js v20+
- MongoDB Atlas (o local)
- Git

### Backend
```bash
git clone https://github.com/AngelCieep/WikiMultiApi.git
cd WikiMultiApi/backend
npm install

# Configurar .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/wikiapi
PORT=3000

npm run dev  # Desarrollo
npm start    # Producción
```

### Frontend Angular
```bash
cd frontend-angular
npm install
ng serve        # http://localhost:4200
ng build --prod # Build
```

### Frontend React
```bash
cd frontend-react
npm install
npm run dev   # http://localhost:5173
npm run build # Build
```

---

## 🌐 Despliegue

### URLs de Producción
- **Backend API:** [https://backend-wikiapi.vercel.app/api/v1](https://backend-wikiapi.vercel.app/api/v1)
- **Frontend Angular:** [https://wiki-multi-api.vercel.app](https://wiki-multi-api.vercel.app)
- **Frontend React:** [https://wiki-multi-api-react.vercel.app](https://wiki-multi-api-react.vercel.app)

### Plataforma
- **Hosting:** Vercel (Backend Serverless + Frontend Static)
- **Base de Datos:** MongoDB Atlas

---

## 👥 Autores

**Ángel Mariblanca** — Backend & Frontend Angular  
**Francisco Vives** — Frontend React

---

**Proyecto Final MEAN Stack** — Febrero 2026
