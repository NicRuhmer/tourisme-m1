const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SousCategorieSchema = new Schema({
    name: String,
    categorie: { type: Schema.Types.ObjectId, ref: 'Categorie' },
    description: String,
    image: String
},
{
    timestamps: true
});

const SousCategorie = mongoose.model('SousCategorie', SousCategorieSchema);

module.exports = SousCategorie;
