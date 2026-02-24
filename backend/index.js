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
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>WikiMultiApi</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',sans-serif;background:#0f1117;color:#e2e8f0;min-height:100vh;padding:40px 20px}
    h1{font-size:2rem;font-weight:800;color:#fff;margin-bottom:4px}
    .subtitle{color:#7a9db5;font-size:1rem;margin-bottom:40px}
    .base{display:inline-block;background:#1e2535;border:1px solid #2d3748;border-radius:8px;padding:8px 16px;font-family:monospace;font-size:.95rem;color:#63b3ed;margin-bottom:40px}
    .section{margin-bottom:36px}
    .section-title{font-size:1.1rem;font-weight:700;color:#90cdf4;border-bottom:1px solid #2d3748;padding-bottom:8px;margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em}
    .endpoint{display:grid;grid-template-columns:90px 1fr auto;align-items:center;gap:12px;background:#1a1f2e;border-radius:10px;padding:12px 16px;margin-bottom:8px;border:1px solid #2d3748}
    .method{font-weight:700;font-size:.8rem;padding:3px 10px;border-radius:20px;text-align:center;font-family:monospace}
    .get{background:#1c4532;color:#68d391}.post{background:#2c2157;color:#b794f4}.put{background:#2a2f1a;color:#d6e56a}.delete{background:#3d1a1a;color:#fc8181}
    .path{font-family:monospace;font-size:.9rem;color:#e2e8f0}
    .path span{color:#f6ad55}
    .desc{font-size:.8rem;color:#718096;text-align:right}
    a{color:inherit;text-decoration:none}
  </style>
</head>
<body>
  <h1>WikiMultiApi</h1>
  <p class="subtitle">by Angel Mariblanca &amp; Francisco Vives</p>
  <div class="base">Base URL: /api/v1</div>

  <div class="section">
    <div class="section-title">🌌 Universos &nbsp;<code style="font-size:.8rem;color:#718096">/api/v1/universes</code></div>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/api/v1/universes</span><span class="desc">Listar universos</span></div>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/api/v1/universes/<span>:id</span></span><span class="desc">Obtener universo</span></div>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/api/v1/universes/style/<span>:slug</span></span><span class="desc">Estilo de universo</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/api/v1/universes</span><span class="desc">Crear universo</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/api/v1/universes/bulk</span><span class="desc">Crear múltiples universos</span></div>
    <div class="endpoint"><span class="method put">PUT</span><span class="path">/api/v1/universes/<span>:id</span></span><span class="desc">Actualizar universo</span></div>
    <div class="endpoint"><span class="method delete">DELETE</span><span class="path">/api/v1/universes/<span>:id</span></span><span class="desc">Eliminar universo</span></div>
  </div>

  <div class="section">
    <div class="section-title">🧑 Personajes &nbsp;<code style="font-size:.8rem;color:#718096">/api/v1/characters</code></div>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/api/v1/characters/all</span><span class="desc">Listar todos los personajes</span></div>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/api/v1/characters/character/<span>:id</span></span><span class="desc">Obtener personaje por ID</span></div>
    <div class="endpoint"><span class="method get">GET</span><span class="path">/api/v1/characters/universe/<span>:iduniverse</span>/character/<span>:idcharacter</span></span><span class="desc">Personaje de universo</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/api/v1/characters</span><span class="desc">Crear personaje</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/api/v1/characters/bulk</span><span class="desc">Crear múltiples personajes</span></div>
    <div class="endpoint"><span class="method post">POST</span><span class="path">/api/v1/characters/universe/<span>:id</span></span><span class="desc">Personajes de un universo</span></div>
    <div class="endpoint"><span class="method put">PUT</span><span class="path">/api/v1/characters/<span>:id</span></span><span class="desc">Actualizar personaje</span></div>
    <div class="endpoint"><span class="method delete">DELETE</span><span class="path">/api/v1/characters/<span>:id</span></span><span class="desc">Eliminar personaje</span></div>
  </div>
</body>
</html>`);
});

// Solo escuchar en local — Vercel inyecta VERCEL=1 automáticamente
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Servidor corriendo en el puerto', port);
  });
}

module.exports = app;

