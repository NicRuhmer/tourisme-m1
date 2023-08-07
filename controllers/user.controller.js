const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ message: "Le mot de passe est manquant" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            token: ""
        });

        try {
            const user = await newUser.save();
            console.log("tonga ato");
            return res.status(201).json(user);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    login: async (req, res) => {
        try {
            const user = await userModel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).json({ message: "Connection échoué" });
            }
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Connection échoué" });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.session.user = user; // stocke l'utilisateur dans la session
            req.session.message = "Connexion réussie"; // stocke un message dans la session
            res.cookie('token', token); // stocke le jeton dans un cookie
            return res.redirect('/dashboard'); // redirige vers la page de tableau de bord
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    logout: (req, res) => {
        req.session.destroy(); // détruit la session
        res.clearCookie('token'); // supprime le cookie de jeton
        return res.redirect('/authentification'); // redirige vers la page de connexion
    },
    refreshToken: async (req, res) => {
        try {
            const user = await userModel.findById(req.user);
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé" });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await userModel.findOneAndUpdate({ _id: user._id }, { token: token });
            return res.status(200).json({ token: token });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.user);
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé" });
            }
            return res.status(200).json(user);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = userController;