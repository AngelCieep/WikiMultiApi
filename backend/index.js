// configuraciones generales
const express = require('express');
const cors = require ('cors');
const morgan = require('morgan');
const app = express();
const {mongoose} = require('./database');
const {json} = require ('express');

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

//rutas
app.use('/api/v1/characters', require('./routes/characters.route'));
app.use('/api/v1/universes', require('./routes/universe.routes'));
app.use('/', (req, res) => res.send('Api funcina en  api/v1'));

// settings
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('Servidor corriendo en el puerto', app.get('port'));
});
