const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiteSchema = new Schema({

    name: {
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
    sousCategorie: { type: Schema.Types.ObjectId, ref: 'SousCategorie' },
    contenu: {
        type: String,
        required: [true, 'Le contenu est requis.'],
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Sites', SiteSchema);
