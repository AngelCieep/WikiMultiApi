//Configuraciones generales
const express = require('express');
const charsCtrl = require('../controllers/characters.controller');
const router = express.Router();

//Rutas
router.post('/', charsCtrl.addCharacter);
router.get('/all', charsCtrl.getCharacters);
router.post('/universe/:id', charsCtrl.getCharactersByUniverse);
router.get('/universe/:iduniverse/character/:idcharacter', charsCtrl.getCharacter);
router.put('/:id', charsCtrl.updateCharacter);
router.delete('/:id', charsCtrl.deleteCharacter);

module.exports = router;