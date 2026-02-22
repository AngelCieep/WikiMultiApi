//Configuraciones generales
const express = require('express');
const charsCtrl = require('../controllers/characters.controller');
const router = express.Router();

//Rutas
router.get('/', charsCtrl.getCharacters);
router.get('/character/:id', charsCtrl.getCharacter);
//router.post('/', charsCtrl.addCharacter);
//router.put('/:id', charsCtrl.updateCharacter);
router.delete('/:id', charsCtrl.deleteCharacter);   

module.exports = router;