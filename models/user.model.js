const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis.'],
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis.'],
        minlength: [6, 'Le mot de passe ne doit pas être inférieur à 6 caractères.']
    },
    token: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
}
);

module.exports = mongoose.model('User', UserSchema);
