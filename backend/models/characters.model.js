import mongoose, { Schema } from 'mongoose';

const characterSchema = new Schema(
	{
		tipo: { type: String, required: true, trim: true },
		name: { type: String, required: true, trim: true },
		title: { type: String, trim: true },
		location: { type: String, trim: true },
		game: { type: String, trim: true },
		imageUrl: { type: String, trim: true },
		weakness: { type: String, trim: true },
		difficulty: { type: String, trim: true },
		role: { type: String, trim: true },
		affiliation: { type: String, trim: true },
		traits: [{ type: String, trim: true }],
		region: { type: String, trim: true },
		description: { type: String, trim: true }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Characters', characterSchema, 'personajes');