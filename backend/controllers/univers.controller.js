const Universe = require('../models/universe.model');
const Characters = require('../models/characters.model');
const universCtrl = {};

//Obtener todos los universos
universCtrl.getUniverses = async (req, res) => {
    await Universe.find({}, '_id name slug logo imagenBoton primaryColor secondaryColor fontFamily isActive popularityScore releaseDate')
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

//Obtener solo campos visuales de un universo por slug
universCtrl.getUniverseStyle = async (req, res) => {
    await Universe.findOne({ slug: req.params.slug }, '_id name slug logo backgroundImage fontFamily primaryColor secondaryColor tertiaryColor textColor')
    .then((data) => {
        if (data != null)
            res.status(200).json({ status: data });
        else
            res.status(404).json({ status: 'Universo no encontrado' });
    })
    .catch((err) => res.status(400).json({ status: err }));
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

//Insertar múltiples universos
universCtrl.addUniverses = async (req, res) => {
    await Universe.insertMany(req.body)
    .then((data) => res.status(201).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
};

//Eliminar un universo por ID (y todos sus personajes)
universCtrl.deleteUniverse = async (req, res) => {
    try {
        // 1. Comprobar personajes huérfanos con ese universeId (siempre, exista o no el universo)
        const charactersCount = await Characters.countDocuments({ universeId: req.params.id });
        if (charactersCount > 0) {
            console.warn(`[DELETE] Se encontraron ${charactersCount} personaje(s) con universeId: ${req.params.id}. Eliminándolos...`);
            await Characters.deleteMany({ universeId: req.params.id });
            console.log(`[DELETE] ${charactersCount} personaje(s) eliminados.`);
        } else {
            console.log(`[DELETE] No hay personajes asociados al id: ${req.params.id}`);
        }

        // 2. Comprobar si existe el universo
        const universe = await Universe.findById(req.params.id);
        if (!universe) {
            console.warn(`[DELETE] No existe ningún universo con id: ${req.params.id}`);
            return res.status(404).json({
                status: `No existe ningún universo con id: ${req.params.id}`,
                personajesEliminados: charactersCount
            });
        }

        // 3. Eliminar el universo
        await Universe.findByIdAndDelete(req.params.id);
        console.log(`[DELETE] Universo "${universe.name}" (${req.params.id}) eliminado.`);

        res.status(200).json({
            status: "Universo eliminado",
            universoEliminado: universe.name,
            personajesEliminados: charactersCount
        });
    } catch (err) {
        res.status(400).json({ status: err });
    }
};

module.exports = universCtrl;
