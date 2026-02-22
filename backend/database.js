const mongoose = require('mongoose');
const URI = 'mongodb+srv://root:root@cluster0.wlf1p1l.mongodb.net/ProyectoAPI?appName=Cluster0';

mongoose.connect(URI)
.then(db => console.log('Base de datos conectada'))
.catch(err => console.log(err));

module.exports = mongoose;