const chars = require('../models/characters.model');
const charsCtrl = {};


//Funciones CRUD
charsCtrl.getCharacters = async (req, res) => {
    await chars.find({}, '_id name title image booleanField universeId')
    .then((data) => res.status(200).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
    
};
//Obtener un personaje por ID
charsCtrl.getCharacter = async (req, res) => {
    const id = req.params.id || req.params.idcharacter;
    const character = await chars.findById(id)
    .then((data) =>{
        if(data!=null)
        res.status(200).json({status: data});
        else
        res.status(404).json({status: "Personaje no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err}));
    
}
//Añadir un personaje
charsCtrl.addCharacter = async (req, res) => {
    const newCharacter = new chars(req.body);
    await newCharacter.save()
    .then((data) => res.status(201).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
}
//Obtener personajes por universo
charsCtrl.getCharactersByUniverse = async (req, res) => {
    await chars.find({ universeId: req.params.id }, '_id name title image booleanField universeId')
    .then((data) => {
        if(data.length > 0)
        res.status(200).json({status: data});
        else
        res.status(404).json({status: "No se encontraron personajes para este universo"});
    })
    .catch((err) => res.status(400).json({status: err}));
}
//Inserción masiva de personajes
charsCtrl.addCharacters = async (req, res) => {
    await chars.insertMany(req.body)
    .then((data) => res.status(201).json({inserted: data.length, status: data}))
    .catch((err) => res.status(400).json({status: err}));
}
//Actualizar un personaje por ID
charsCtrl.updateCharacter = async (req, res) => {
    await chars.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((data) => {
        if(data!=null)
        res.status(200).json({status: data});
        else
        res.status(404).json({status: "Personaje no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err}));
}
charsCtrl.deleteCharacter = async (req, res) => {
    await chars.findByIdAndDelete(req.params.id)
    .then((data) => {
        if(data)res.status(200).json({status: "Personaje eliminado"});
        else res.status(404).json({status: "Personaje no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err})); 
}



module.exports = charsCtrl;
