const mongoose = require('mongoose');
const { Schema } = mongoose;

const characterSchema = new Schema(
	{
		// Información principal
		name:        { type: String, required: true, trim: true },
		title:       { type: String, trim: true },
		description: { type: String, trim: true },

		descriptionSections: [
			{
				sectionTitle: { type: String, trim: true },
				content:      { type: String, trim: true }
			}
		],

		universeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Universe' },
		image:      { type: String, trim: true },

		// Información adicional
		location:    { type: String, trim: true },
		affiliation: { type: String, trim: true },

		type:      { type: String, trim: true },
		abilities: [{ type: String, trim: true }],

		stats: { type: Map, of: Number },

		// Campos obligatorios proyecto
		numericField: { type: Number,  required: true },
		dateField:    { type: Date,    required: true },
		booleanField: { type: Boolean, required: true }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Characters', characterSchema, 'personajes');