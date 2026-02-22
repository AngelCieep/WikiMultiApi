const mongoose = require('mongoose');
const { Schema } = mongoose;

const universeSchema = new Schema(
    {
        name:             { type: String, required: true, trim: true },
        slug:             { type: String, required: true, trim: true, unique: true },
        description:      { type: String, trim: true },

        logo:             { type: String, trim: true },
        backgroundImage:  { type: String, trim: true },
        fontFamily:       { type: String, trim: true },
        primaryColor:     { type: String, trim: true },
        secondaryColor:   { type: String, trim: true },

        popularityScore:  { type: Number, required: true },
        releaseDate:      { type: Date,   required: true },
        isActive:         { type: Boolean, required: true },

        labels: {
            type:      { type: String, trim: true },
            abilities: { type: String, trim: true },
            stats:     { type: String, trim: true }
        },

        typeLabels:    { type: Map, of: String },
        statLabels:    { type: Map, of: String },
        abilityLabels: { type: Map, of: String }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Universe', universeSchema, 'universos');