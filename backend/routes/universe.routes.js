//Configuraciones generales
const express = require('express');
const universCtrl = require('../controllers/univers.controller');
const router = express.Router();

//Rutas
router.get('/', universCtrl.getUniverses);
router.get('/style/:slug', universCtrl.getUniverseStyle);
router.get('/:id', universCtrl.getUniverse);
router.post('/', universCtrl.addUniverse);
router.post('/bulk', universCtrl.addUniverses);
router.put('/:id', universCtrl.updateUniverse);
router.delete('/:id', universCtrl.deleteUniverse);

module.exports = router;