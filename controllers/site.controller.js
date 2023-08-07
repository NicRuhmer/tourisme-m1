const siteModel = require('../models/site.model');
const sousCategorieModel = require('../models/sousCategorie.model');
const categorieModel = require('../models/categorie.model');

const siteController = {
    addSite: async (req, res) => {
        try {
            const { name, description, sousCategorieId, contenu } = req.body;
            let imagePath = null;
            let videoPath = null;

            if (req.files['image'] && req.files['image'].length > 0) {
                imagePath = '/uploads/images/' + req.files['image'][0].filename;
            }

            if (req.files['video'] && req.files['video'].length > 0) {
                videoPath = '/uploads/videos/' + req.files['video'][0].filename;
            }

            // Vérifier si le site existe déjà
            const siteExistant = await siteModel.findOne({ name });
            if (siteExistant) {
                return res.status(400).json({ message: "Ce site touristique existe déjà" });
            }

            // Créer un nouveau site touristique
            const nouveauSite = new siteModel({
                name: name,
                description: description,
                sousCategorie: sousCategorieId,
                image: imagePath,
                video: videoPath,
                contenu: contenu
            });
            await nouveauSite.save();
            const sousCategorie = await sousCategorieModel.findById(sousCategorieId);
            res.redirect('/sous-categorie/' + sousCategorie.name);
        } catch (error) {
            console.error("Erreur lors de l'ajout du site:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    getAllSites: async (req, res) => {
        try {
            const sites = await siteModel.find({ sousCategorie: req.params.id }).populate({ path: "sousCategorie" });
            res.status(200).send(sites);
        } catch (error) {
            console.error("Erreur lors de la récupération des sites touristiques:", error);
            res.status(400).send({ message: "Erreur interne du serveur" });
        }
    },

    getSite: async (req, res) => {
        try {
            const site = await siteModel.findById(req.params.id).populate({path:"sousCategorie"});
            if (!site) {
                 res.status(400).send({ message: "Site touristique introuvable" });
            }
            res.status(200).send(site);
        } catch (error) {
            console.error("Erreur lors de la récupération du site touristique:", error);
            res.status(400).send({ message: "Erreur interne du serveur" });
        }
    }
};

module.exports = siteController;
