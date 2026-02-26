const chars = require('../models/characters.model');
const Universe = require('../models/universe.model');
const charsCtrl = {};

//Obtener todos los personajes (con paginación)
charsCtrl.getCharacters = async (req, res) => {
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
            chars.find({}, '_id name title image booleanField universeId views')
                .skip(skip)
                .limit(limit),
            chars.countDocuments()
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
        console.error('Error en getCharacters:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
//Obtener un personaje por ID (incrementa vistas automáticamente)
charsCtrl.getCharacter = async (req, res) => {
    try {
        const id = req.params.id || req.params.idcharacter;
        
        const data = await chars.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ error: "Personaje no encontrado" });
        }

        res.status(200).json({ status: data });
    } catch (err) {
        console.error('Error en getCharacter:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de personaje inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
//Añadir un personaje
charsCtrl.addCharacter = async (req, res) => {
    try {
        // VALIDACIÓN DE LÓGICA DE NEGOCIO: Verificar que el universeId existe
        if (req.body.universeId) {
            const universeExists = await Universe.findById(req.body.universeId);
            if (!universeExists) {
                return res.status(404).json({ 
                    error: 'El universo especificado no existe',
                    field: 'universeId'
                });
            }
        }

        const newCharacter = new chars(req.body);
        const data = await newCharacter.save();
        
        res.status(201).json({ status: data });
    } catch (err) {
        console.error('Error en addCharacter:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Datos de validación incorrectos', 
                details: err.message 
            });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
//Obtener personajes por universo (con paginación)
charsCtrl.getCharactersByUniverse = async (req, res) => {
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
            chars.find({ universeId: req.params.id }, '_id name title image booleanField universeId views')
                .skip(skip)
                .limit(limit),
            chars.countDocuments({ universeId: req.params.id })
        ]);

        if (total === 0) {
            return res.status(404).json({ 
                error: "No se encontraron personajes para este universo" 
            });
        }

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
        console.error('Error en getCharactersByUniverse:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de universo inválido' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
//Actualizar un personaje por ID
charsCtrl.updateCharacter = async (req, res) => {
    try {
        // VALIDACIÓN: Si se intenta cambiar el universeId, verificar que existe
        if (req.body.universeId) {
            const universeExists = await Universe.findById(req.body.universeId);
            if (!universeExists) {
                return res.status(404).json({ 
                    error: 'El universo especificado no existe',
                    field: 'universeId'
                });
            }
        }

        const data = await chars.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!data) {
            return res.status(404).json({ error: "Personaje no encontrado" });
        }

        res.status(200).json({ status: data });
    } catch (err) {
        console.error('Error en updateCharacter:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de personaje inválido' });
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
//Eliminar un personaje por ID
charsCtrl.deleteCharacter = async (req, res) => {
    try {
        const data = await chars.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).json({ error: "Personaje no encontrado" });
        }

        res.status(200).json({ status: "Personaje eliminado" });
    } catch (err) {
        console.error('Error en deleteCharacter:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de personaje inválido' });
        }
        res.status(500).json({ error: 'Error al eliminar personaje' });
    }
};

//Obtener personajes filtrados y ordenados con paginación
charsCtrl.getCharactersFiltered = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt'; // createdAt, updatedAt, views
        const order = req.query.order === 'asc' ? 1 : -1; // desc por defecto

        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({ 
                error: 'Parámetros inválidos. Page debe ser >= 1, limit entre 1 y 100' 
            });
        }

        const allowedSortFields = ['createdAt', 'updatedAt', 'views', 'name'];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ 
                error: `sortBy debe ser uno de: ${allowedSortFields.join(', ')}` 
            });
        }

        const sortObject = {};
        sortObject[sortBy] = order;

        const [data, total] = await Promise.all([
            chars.find(
                {}, 
                '_id name title image booleanField universeId views createdAt updatedAt'
            )
                .sort(sortObject)
                .skip(skip)
                .limit(limit),
            chars.countDocuments()
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
        console.error('Error en getCharactersFiltered:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = charsCtrl;
