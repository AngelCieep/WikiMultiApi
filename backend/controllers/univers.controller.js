const Universe = require('../models/universe.model');
const Characters = require('../models/characters.model');
const universCtrl = {};

//Obtener todos los universos
universCtrl.getUniverses = async (req, res) => {
    await Universe.find({}, '_id name slug logo backgroundImage imagenBoton primaryColor secondaryColor fontFamily isActive popularityScore releaseDate hasType hasAbilities hasStats')
    .then((data) => res.status(200).json({status: data}))
    .catch((err) => res.status(400).json({status: err}));
};

//Obtener un universo por ID
universCtrl.getUniverse = async (req, res) => {
    await Universe.findById(req.params.id)
    .then((data) => {
        if(data != null) {
            // Transform flat labels to nested object
            const response = {
                ...data.toObject(),
                labels: {
                    type: data.labelType,
                    abilities: data.labelAbilities,
                    stats: data.labelStats
                }
            };
            res.status(200).json({status: response});
        }
        else
        res.status(404).json({status: "Universo no encontrado"});
    })
    .catch((err) => res.status(400).json({status: err}));
};

//Obtener solo campos visuales de un universo por slug
universCtrl.getUniverseStyle = async (req, res) => {
    await Universe.findOne({ slug: req.params.slug }, '_id name slug logo backgroundImage fontFamily primaryColor secondaryColor tertiaryColor textColor backgroundImage isActive hasType hasAbilities hasStats labelType labelAbilities labelStats')
    .then((data) => {
        if (data != null) {
            // Transform flat labels to nested object
            const response = {
                ...data.toObject(),
                labels: {
                    type: data.labelType,
                    abilities: data.labelAbilities,
                    stats: data.labelStats
                }
            };
            // Remove flat fields from response
            delete response.labelType;
            delete response.labelAbilities;
            delete response.labelStats;
            res.status(200).json({ status: response });
        }
        else
            res.status(404).json({ status: 'Universo no encontrado' });
    })
    .catch((err) => res.status(400).json({ status: err }));
};

//Añadir un universo
universCtrl.addUniverse = async (req, res) => {
    // Transform nested labels to flat structure
    const body = { ...req.body };
    if (body.labels) {
        body.labelType = body.labels.type;
        body.labelAbilities = body.labels.abilities;
        body.labelStats = body.labels.stats;
        delete body.labels;
    }
    const newUniverse = new Universe(body);
    await newUniverse.save()
    .then((data) => {
        const response = {
            ...data.toObject(),
            labels: {
                type: data.labelType,
                abilities: data.labelAbilities,
                stats: data.labelStats
            }
        };
        res.status(201).json({status: response});
    })
    .catch((err) => res.status(400).json({status: err}));
};

//Actualizar un universo por ID
universCtrl.updateUniverse = async (req, res) => {
    // Transform nested labels to flat structure
    const body = { ...req.body };
    if (body.labels) {
        body.labelType = body.labels.type;
        body.labelAbilities = body.labels.abilities;
        body.labelStats = body.labels.stats;
        delete body.labels;
    }
    await Universe.findByIdAndUpdate(req.params.id, body, {new: true})
    .then((data) => {
        if(data != null) {
            const response = {
                ...data.toObject(),
                labels: {
                    type: data.labelType,
                    abilities: data.labelAbilities,
                    stats: data.labelStats
                }
            };
            res.status(200).json({status: response});
        }
        else
        res.status(404).json({status: "Universo no encontrado"});
    })
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
