const sousCategorieModel = require('../models/sousCategorie.model');
const categorieModel = require('../models/categorie.model');

const sousCategorieController = {

    addSousCategorie: async (req, res) => {
        try {
            const { name, categorieId, description } = req.body;

            const imagePath = req.file ? '/uploads/' + req.file.filename : null;

            const sousCategorieExistante = await sousCategorieModel.findOne({ name });
            if (sousCategorieExistante) {
                return res.status(400).json({ message: "Cette sous-catégorie existe déjà" });
            }

            const categorie = await categorieModel.findById(categorieId);
            if (!categorie) {
                return res.status(404).json({ message: "Catégorie principale introuvable" });
            }

            const nouvelleSousCategorie = new sousCategorieModel({
                name: name,
                categorie: categorieId,
                description: description,  // Ajoutez cette ligne pour la description
                image: imagePath  // Ajoutez cette ligne pour le chemin de l'image
            });
            await nouvelleSousCategorie.save();

            res.redirect('/dashboard');
        } catch (error) {
            console.error("Erreur lors de l'ajout de la sous-catégorie:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    getAllSousCategories: async (req, res) => {

        try {
            const sousCategories = await sousCategorieModel.find().populate("categorie");
            res.status(200).send(sousCategories);

        } catch (error) {
            console.error("Erreur lors de la récupération des sous-catégories:", error);
            res.status(400).send({ message: "Erreur interne du serveur" });
        }
    },

    getAllSousCategoriesByCategorie: async (req, res) => {
        res.setHeader("Content-Type", "application/json");


        try {
            const sousCategories = await sousCategorieModel.find({ categorie: req.params.id }).populate({ path: "categorie" });

            res.status(200).send(sousCategories);

        } catch (error) {
            console.error("Erreur lors de la récupération des sous-catégories:", error);
            res.status(400).send({ message: "Erreur interne du serveur" });
        }
    },


    getSousCategorie: async (req, res) => {
        try {
            const sousCategorie = await sousCategorieModel.findById(req.params.id);
            res.status(200).json({ data: sousCategorie });
        } catch (error) {
            console.error("Erreur lors de la récupération de la sous-catégorie:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },
};

module.exports = sousCategorieController;
