const mongoose = require('mongoose');
const { Schema } = mongoose;

const universeSchema = new Schema(
    {
        name:             { type: String, required: true, trim: true },
        slug:             { type: String, required: true, trim: true, unique: true },
        description:      { type: String, trim: true },

        logo:             { type: String, trim: true },
        backgroundImage:  { type: String, trim: true },
        imagenBoton:      { type: String, trim: true },
        fontFamily:       { type: String, trim: true },
        primaryColor:     { type: String, trim: true },
        secondaryColor:   { type: String, trim: true },
        tertiaryColor:    { type: String, trim: true },
        textColor:        { type: String, trim: true },

        popularityScore:  { type: Number, required: true },
        releaseDate:      { type: Date,   required: true },
        isActive:         { type: Boolean, required: true },

        // Display flags
        hasType:        { type: Boolean, default: true },
        hasAbilities:   { type: Boolean, default: true },
        hasStats:       { type: Boolean, default: true },

        labelType:      { type: String, trim: true },
        labelAbilities: { type: String, trim: true },
        labelStats:     { type: String, trim: true },

        statLabels:    { type: Map, of: String },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Universe', universeSchema, 'universos');