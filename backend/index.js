// configuraciones generales
const express = require('express');
const cors = require ('cors');
const morgan = require('morgan');
const app = express();
const connectDB = require('./database');

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure DB is connected before handling any request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

//rutas
app.use('/api/v1/characters', require('./routes/characters.route'));
app.use('/api/v1/universes', require('./routes/universe.routes'));

app.get('/', (req, res) => {
  res.json({
    nombre: 'WikiMultiApi',
    version: '1.0.0',
    autores: ['Angel Mariblanca', 'Francisco Vives'],
    descripcion: 'API REST para gestionar universos (series, películas, videojuegos) y sus personajes',
    base_url: '/api/v1',
    endpoints: {
      universos: [
        { metodo: 'GET',    ruta: '/api/v1/universes',              descripcion: 'Obtener todos los universos' },
        { metodo: 'GET',    ruta: '/api/v1/universes/:id',          descripcion: 'Obtener un universo por ID' },
        { metodo: 'GET',    ruta: '/api/v1/universes/style/:slug',  descripcion: 'Obtener estilo visual de un universo' },
        { metodo: 'POST',   ruta: '/api/v1/universes',              descripcion: 'Crear un universo' },
        { metodo: 'POST',   ruta: '/api/v1/universes/bulk',         descripcion: 'Crear múltiples universos' },
        { metodo: 'PUT',    ruta: '/api/v1/universes/:id',          descripcion: 'Actualizar un universo' },
        { metodo: 'DELETE', ruta: '/api/v1/universes/:id',          descripcion: 'Eliminar un universo' }
      ],
      personajes: [
        { metodo: 'GET',    ruta: '/api/v1/characters/all',                                          descripcion: 'Obtener todos los personajes' },
        { metodo: 'GET',    ruta: '/api/v1/characters/character/:id',                                descripcion: 'Obtener un personaje por ID' },
        { metodo: 'GET',    ruta: '/api/v1/characters/universe/:iduniverse/character/:idcharacter',  descripcion: 'Obtener un personaje de un universo' },
        { metodo: 'POST',   ruta: '/api/v1/characters',                                             descripcion: 'Crear un personaje' },
        { metodo: 'POST',   ruta: '/api/v1/characters/bulk',                                        descripcion: 'Crear múltiples personajes' },
        { metodo: 'POST',   ruta: '/api/v1/characters/universe/:id',                                descripcion: 'Obtener personajes de un universo' },
        { metodo: 'PUT',    ruta: '/api/v1/characters/:id',                                         descripcion: 'Actualizar un personaje' },
        { metodo: 'DELETE', ruta: '/api/v1/characters/:id',                                         descripcion: 'Eliminar un personaje' }
      ]
    }
  });
});
// Solo escuchar en local — Vercel inyecta VERCEL=1 automáticamente
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Servidor corriendo en el puerto', port);
  });
}

module.exports = app;

