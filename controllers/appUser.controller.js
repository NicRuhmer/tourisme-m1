const appUserModel = require('../models/appUser.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const appUserController = {
    register: async (req, res) => {
        const password = req.body.password;
        if (!password) {
            return res.status(400).json({ message: "Le mot de passe est manquant" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new appUserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            token: ""
        });

        try {
            const user = await newUser.save();
            res.status(201).send(user);
        }
        catch (err) {
            res.status(500).send(err);
        }
    },

    update: async (req, res) => {

        const hashedPassword = bcrypt.hashSync(password, 10);

        const dataUpdated = {
            name: req.body.name,
            email: req.body.email
        };

        if (req.body.password) {
            dataUpdated = {
                name: req.body.name,
                email: req.body.email, password: hashedPassword
            };
        }


        try {
            if (req.body.name != null && req.body.email != null) {
                appUserModel.findByIdAndUpdate(
                    req.params.id,
                    dataUpdated,
                    { upsert: true },
                    function (err, doc) {
                        if (err) {
                            res.status(400).send({ status: 400, message: "Erreur lors de la modification de donnée!" });
                        } else {
                            res.status(200).send({ status: 200, message: "Success" });
                        }
                    });
            } else {
                res.status(400).send({ status: 400, message: "Champs invalides" });
            }
        }
        catch (err) {
            res.status(400).send(err);
        }
    },

    login: async (req, res) => {
        try {
            const user = await appUserModel.findOne({ email: req.body.email });
            if (!user) {
                res.status(400).send({ message: "Connection échoué" });
            }
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatch) {
                res.status(400).send({ message: "Connection échoué" });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.session.user = user;
            req.session.message = "Connexion réussie";
            res.cookie('token', token);

            res.status(200).send(user);
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    },

    

    logout: (req, res) => {
        req.session.destroy(); // détruit la session
        res.clearCookie('token'); // supprime le cookie de jeton
        return res.redirect('/authentification'); // redirige vers la page de connexion
    },

    refreshToken: async (req, res) => {
        try {
            const user = await appUserModel.findById(req.user);
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé" });
            }
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            await appUserModel.findOneAndUpdate({ _id: user._id }, { token: token });
            return res.status(200).json({ token: token });
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },

    getUser: async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await appUserModel.findById(userId);
            if (!user) {
                return res.status(401).json({ message: "Utilisateur non trouvé" });
            }
            res.json(user);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    //get all appUsers
    getAllAppUsers: async () => {
        try {
            const appUsers = await appUserModel.find();
            return appUsers;
        }
        catch (err) {
            throw err; // Lancez l'erreur pour que la route puisse la gérer
        }
    }
}

module.exports = appUserController;