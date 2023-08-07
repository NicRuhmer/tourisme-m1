const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InteretSpecifiqueSchema = new Schema({
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
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('PointInteret', InteretSpecifiqueSchema);
