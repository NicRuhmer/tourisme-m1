const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorieSchema = new Schema({
    name: String
}, {
    timestamps: true
}
);

module.exports = mongoose.model('Categorie', CategorieSchema);
