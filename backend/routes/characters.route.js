//Configuraciones generales
const express = require('express');
const charsCtrl = require('../controllers/characters.controller');
const router = express.Router();

//Rutas
router.get('/all', charsCtrl.getCharacters);
router.get('/:id', charsCtrl.getCharacter);
router.post('/', charsCtrl.addCharacter);
router.post('/bulk', charsCtrl.addCharacters);
router.post('/Universe/:id', charsCtrl.getCharactersByUniverse);
router.put('/:id', charsCtrl.updateCharacter);
router.delete('/:id', charsCtrl.deleteCharacter);

module.exports = router;