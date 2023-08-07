const appUserModel = require('../models/appUser.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const appUserController = {

    register: async (req, res) => {
        res.setHeader("Content-Type", "application/json");

        try {


            if (req.body.name != null && req.body.email != null) {
                var password = req.body.password;
                if (!password) {
                    return res.status(400).send({ message: "Le mot de passe est manquant" });
                }

                const tmp = await appUserModel.find({ email: req.body.email });
                if (tmp.length > 0) {
                    res.status(400).send({ status: 400, message: "Email est déjà utiliser" });
                } else {
                    const hashedPassword = bcrypt.hashSync(password, 10);
                    const newUser = new appUserModel({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword,
                        token: ""
                    });
                    const user = await newUser.save();
                    res.status(200).send(user);
                }

            } else {
                res.status(400).send({ status: 400, message: "Données invalides" });
            }

        }
        catch (err) {
            console.log(err.message)
            res.status(400).send(err);
        }
    },

    update: async (req, res) => {
        res.setHeader("Content-Type", "application/json");


        try {

            if (req.body.name != null && req.body.email != null) {

                if (req.body.password != "" && req.body.password != null) {
                    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                    const dataUpdated2 = {
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword
                    };
                    appUserModel.findByIdAndUpdate(req.params.id, dataUpdated2, { upsert: true }).then((result) => {
                        res.status(200).send(result);

                    }).catch((err) => {
                        console.log("tonga 3: " + err.message);
                        res.status(400).send({ status: 400, message: err.message });
                    });
                } else {
                    const dataUpdated = {
                        name: req.body.name,
                        email: req.body.email
                    };

                    appUserModel.findByIdAndUpdate(req.params.id, dataUpdated, { upsert: true }).then((result) => {
                        res.status(200).send(result);

                    }).catch((err) => {
                        console.log("tonga 3: " + err.message);
                        res.status(400).send({ status: 400, message: err.message });
                    });
                }

            } else {

                res.status(400).send({ status: 400, message: "Champs invalides" });
            }
        }
        catch (err) {
            console.log(err.message);
            res.status(400).send(err.message);
        }
    },

    login: async (req, res) => {
        res.setHeader("Content-Type", "application/json");

        try {

            const user = await appUserModel.findOne({ email: req.body.email });


            if (!user) {
                res.status(400).send({ message: "Connection échoué" });
            }
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatch) {
                res.status(400).send({ message: "Connection échoué" });
            } else {

                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                req.session.user = user;
                req.session.message = "Connexion réussie";
                res.cookie('token', token);

                res.status(200).send(user);
            }

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