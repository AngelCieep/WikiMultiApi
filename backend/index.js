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
app.use('/', (req, res) => res.send('Api funciona en api/v1'));

// Solo escuchar en local, no en Vercel
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Servidor corriendo en el puerto', port);
  });
}

module.exports = app;

