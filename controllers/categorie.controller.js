const categorieModel = require('../models/categorie.model');

const categorieController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await categorieModel.find(); // Trouver toutes les catégories
            return categories;
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },
    addCategorie: async (req, res) => {
        try {
            const { name } = req.body; // Extrayez directement 'name' de req.body

            // Vérifiez si la catégorie existe déjà
            const categorieExistante = await categorieModel.findOne({ name }); // Utilisez 'name' comme clé
            if (categorieExistante) {
                return res.status(400).json({ message: "Cette catégorie existe déjà" });
            }

            // Créez une nouvelle catégorie
            const nouvelleCategorie = new categorieModel({ name }); // Utilisez 'name' ici aussi
            await nouvelleCategorie.save();

            return res.redirect('/dashboard');
        } catch (error) {
            console.error("Erreur lors de l'ajout de la catégorie:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },
    getCategorie: async (req, res) => {
        try {
            const categorie = await categorieModel.findById(req.params.id);
            return res.status(200).json(categorie);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }



};

module.exports = categorieController;
