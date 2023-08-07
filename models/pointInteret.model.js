const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PointInteretSchema = new Schema({

    nom: {
        type: String,
        required: [true, 'Le nom est requis.'],
    },
    description: {
        type: String,
        required: [true, 'La description est requise.'],
    },
    image: {
        type: String,
        required: [true, 'L\'image est requise.'],
    },
    video: {
        type: String,
    },
    contenu: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('PointInteret', PointInteretSchema);