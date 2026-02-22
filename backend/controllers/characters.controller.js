const chars = require('../models/characters.model');
const charsCtrl = {};


//Funciones CRUD
charsCtrl.getCharacters = async (req, res) => {
   
    const characters = await chars.find()
    .then((data) => res.status(200).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
    
};
//Obtener un personaje por ID
charsCtrl.getCharacter = async (req, res) => {
    const character = await chars.findById(req.params.id)
    .then((data) =>{
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
