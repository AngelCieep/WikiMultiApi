//Configuraciones generales
const express = require('express');
const charsCtrl = require('../controllers/characters.controller');
const router = express.Router();

//Rutas
router.get('/all', charsCtrl.getCharacters);
router.get('/top', charsCtrl.getMostViewedCharacter);
router.get('/character/:id', charsCtrl.getCharacter);
router.get('/universe/:iduniverse/character/:idcharacter', charsCtrl.getCharacter);
router.post('/', charsCtrl.addCharacter);
router.post('/bulk', charsCtrl.addCharacters);
router.post('/universe/:id', charsCtrl.getCharactersByUniverse);
router.put('/:id', charsCtrl.updateCharacter);
router.delete('/:id', charsCtrl.deleteCharacter);

module.exports = router;