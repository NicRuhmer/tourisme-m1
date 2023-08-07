const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaisonSchema = new Schema({
    periode: {
        type: String,
        required: [true, 'La période est requise.'],
    },
    //référence à la collection des destinations
    destinations: [{
        type: Schema.Types.ObjectId,
        ref: 'Destination'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Saison', SaisonSchema);