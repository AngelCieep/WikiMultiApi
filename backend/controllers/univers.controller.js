const Universe = require('../models/universe.model');
const Characters = require('../models/characters.model');
const universCtrl = {};

//Obtener todos los universos (con paginación)
universCtrl.getUniverses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                error: 'Parámetros inválidos. Page debe ser >= 1, limit entre 1 y 100' 
            });
        }

        const [data, total] = await Promise.all([
            Universe.find({}, '_id name slug logo backgroundImage imagenBoton primaryColor secondaryColor fontFamily isActive popularityScore releaseDate hasType hasAbilities hasStats')
                .skip(skip)
                .limit(limit),
            Universe.countDocuments()
        ]);

        res.status(200).json({
            status: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error en getUniverses:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Obtener un universo por ID
universCtrl.getUniverse = async (req, res) => {
    try {
        const data = await Universe.findById(req.params.id);
        
        if (!data) {
            return res.status(404).json({ error: "Universo no encontrado" });
        }

        // Transform flat labels to nested object
        const response = {
            ...data.toObject(),
            labels: {
                type: data.labelType,
                abilities: data.labelAbilities,
                stats: data.labelStats
            }
        };
        res.status(200).json({ status: response });
    } catch (err) {
        console.error('Error en getUniverse:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de universo inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Obtener solo campos visuales de un universo por slug
universCtrl.getUniverseStyle = async (req, res) => {
    try {
        const data = await Universe.findOne(
            { slug: req.params.slug }, 
            '_id name slug logo backgroundImage fontFamily primaryColor secondaryColor tertiaryColor textColor backgroundImage isActive hasType hasAbilities hasStats labelType labelAbilities labelStats'
        );

        if (!data) {
            return res.status(404).json({ error: 'Universo no encontrado' });
        }

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
    } catch (err) {
        console.error('Error en getUniverseStyle:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Añadir un universo
universCtrl.addUniverse = async (req, res) => {
    try {
        // Transform nested labels to flat structure
        const body = { ...req.body };
        if (body.labels) {
            body.labelType = body.labels.type;
            body.labelAbilities = body.labels.abilities;
            body.labelStats = body.labels.stats;
            delete body.labels;
        }

        // VALIDACIÓN DE LÓGICA DE NEGOCIO: Verificar que el slug no existe
        if (body.slug) {
            const existingUniverse = await Universe.findOne({ slug: body.slug });
            if (existingUniverse) {
                return res.status(409).json({ 
                    error: 'Ya existe un universo con ese slug',
                    field: 'slug'
                });
            }
        }

        // VALIDACIÓN: popularityScore debe estar entre 0-100
        if (body.popularityScore !== undefined) {
            if (typeof body.popularityScore !== 'number' || body.popularityScore < 0 || body.popularityScore > 100) {
                return res.status(400).json({ 
                    error: 'popularityScore debe ser un número entre 0 y 100',
                    field: 'popularityScore'
                });
            }
        }

        const newUniverse = new Universe(body);
        const data = await newUniverse.save();

        const response = {
            ...data.toObject(),
            labels: {
                type: data.labelType,
                abilities: data.labelAbilities,
                stats: data.labelStats
            }
        };
        res.status(201).json({ status: response });
    } catch (err) {
        console.error('Error en addUniverse:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Datos de validación incorrectos', 
                details: err.message 
            });
        }
        if (err.code === 11000) {
            return res.status(409).json({ 
                error: 'Ya existe un universo con ese slug',
                field: 'slug'
            });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Actualizar un universo por ID
universCtrl.updateUniverse = async (req, res) => {
    try {
        // Transform nested labels to flat structure
        const body = { ...req.body };
        if (body.labels) {
            body.labelType = body.labels.type;
            body.labelAbilities = body.labels.abilities;
            body.labelStats = body.labels.stats;
            delete body.labels;
        }

        // VALIDACIÓN: Si se intenta cambiar el slug, verificar que no existe
        if (body.slug) {
            const existingUniverse = await Universe.findOne({ 
                slug: body.slug, 
                _id: { $ne: req.params.id } 
            });
            if (existingUniverse) {
                return res.status(409).json({ 
                    error: 'Ya existe otro universo con ese slug',
                    field: 'slug'
                });
            }
        }

        // VALIDACIÓN: popularityScore debe estar entre 0-100
        if (body.popularityScore !== undefined) {
            if (typeof body.popularityScore !== 'number' || body.popularityScore < 0 || body.popularityScore > 100) {
                return res.status(400).json({ 
                    error: 'popularityScore debe ser un número entre 0 y 100',
                    field: 'popularityScore'
                });
            }
        }

        const data = await Universe.findByIdAndUpdate(req.params.id, body, { new: true });

        if (!data) {
            return res.status(404).json({ error: "Universo no encontrado" });
        }

        const response = {
            ...data.toObject(),
            labels: {
                type: data.labelType,
                abilities: data.labelAbilities,
                stats: data.labelStats
            }
        };
        res.status(200).json({ status: response });
    } catch (err) {
        console.error('Error en updateUniverse:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de universo inválido' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Datos de validación incorrectos', 
                details: err.message 
            });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Actualizar solo el popularityScore de un universo
universCtrl.updatePopularityScore = async (req, res) => {
    try {
        const { popularityScore } = req.body;
        
        if (popularityScore === undefined || typeof popularityScore !== 'number' || popularityScore < 0 || popularityScore > 100) {
            return res.status(400).json({ 
                error: 'popularityScore debe ser un número entre 0 y 100',
                field: 'popularityScore'
            });
        }

        const data = await Universe.findByIdAndUpdate(
            req.params.id, 
            { popularityScore }, 
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ error: 'Universo no encontrado' });
        }

        res.status(200).json({ status: data });
    } catch (err) {
        console.error('Error en updatePopularityScore:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de universo inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
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
        console.error('Error en deleteUniverse:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de universo inválido' });
        }
        res.status(400).json({ error: 'Error al eliminar universo' });
    }
};

//Obtener universos filtrados y ordenados con paginación
universCtrl.getUniversesFiltered = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt'; // createdAt, updatedAt, popularityScore
        const order = req.query.order === 'asc' ? 1 : -1; // desc por defecto

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                error: 'Parámetros inválidos. Page debe ser >= 1, limit entre 1 y 100' 
            });
        }

        const allowedSortFields = ['createdAt', 'updatedAt', 'popularityScore', 'name', 'releaseDate'];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ 
                error: `sortBy debe ser uno de: ${allowedSortFields.join(', ')}` 
            });
        }

        const sortObject = {};
        sortObject[sortBy] = order;

        const [data, total] = await Promise.all([
            Universe.find(
                {}, 
                '_id name slug logo backgroundImage imagenBoton primaryColor secondaryColor fontFamily isActive popularityScore releaseDate hasType hasAbilities hasStats createdAt updatedAt'
            )
                .sort(sortObject)
                .skip(skip)
                .limit(limit),
            Universe.countDocuments()
        ]);

        res.status(200).json({
            status: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                sortBy,
                order: order === 1 ? 'asc' : 'desc'
            }
        });
    } catch (err) {
        console.error('Error en getUniversesFiltered:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = universCtrl;
