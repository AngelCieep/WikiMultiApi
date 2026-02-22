const Universe = require('../models/universe.model');
const universCtrl = {};

//Obtener todos los universos
universCtrl.getUniverses = async (req, res) => {
    await Universe.find({}, '_id name slug logo primaryColor secondaryColor isActive')
    .then((data) => res.status(200).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
};

//Obtener un universo por ID
universCtrl.getUniverse = async (req, res) => {
    await Universe.findById(req.params.id)
    .then((data) => {
        if(data != null)
        res.status(200).json({status: data});
        else
        res.status(404).json({status: "Universo no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err}));
};

//Añadir un universo
universCtrl.addUniverse = async (req, res) => {
    const newUniverse = new Universe(req.body);
    await newUniverse.save()
    .then((data) => res.status(201).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
};

//Actualizar un universo por ID
universCtrl.updateUniverse = async (req, res) => {
    await Universe.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((data) => {
        if(data != null)
        res.status(200).json({status: data});
        else
        res.status(404).json({status: "Universo no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err}));
};

//Eliminar un universo por ID
universCtrl.deleteUniverse = async (req, res) => {
    await Universe.findByIdAndDelete(req.params.id)
    .then((data) => {
        if(data) res.status(200).json({status: "Universo eliminado"});
        else res.status(404).json({status: "Universo no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err}));
};

module.exports = universCtrl;
