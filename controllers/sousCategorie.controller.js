const sousCategorieModel = require('../models/sousCategorie.model');
const categorieModel = require('../models/categorie.model');

const sousCategorieController = {

    addSousCategorie: async (req, res) => {
        try {
            const { name, categorieId, description } = req.body;

            // console.log(req.files);

            let imagePath = null;
            let videoPath = null;

            if (req.files['image'] && req.files['image'].length > 0) {
                imagePath = '/uploads/images/' + req.files['image'][0].filename;
            }

            if (req.files['video'] && req.files['video'].length > 0) {
                videoPath = '/uploads/videos/' + req.files['video'][0].filename;
            }

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

    getApiSousCategories: async (req, res) => {

        try {
            const sousCategories = await sousCategorieModel.find().populate("categorie");
            res.status(200).send(sousCategories);

        } catch (error) {
            console.error("Erreur lors de la récupération des sous-catégories:", error);
            res.status(400).send({ message: "Erreur interne du serveur" });
        }
    },

    getAllSousCategories:  () => {

        return new Promise(async (resolve, reject) => {
            try {
                const sousCategories = await sousCategorieModel.find().populate("categorie");
               resolve(sousCategories);
    
            } catch (error) {
                console.error("Erreur lors de la récupération des sous-catégories:", error);
                reject({ message: "Erreur interne du serveur" });
            }
        });
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

    updateSousCategorie: async (req, res) => {
        try {
            const { name, categorieId, description } = req.body;
            const sousCategorieId = req.params.id;

            let imagePath = null;
            let videoPath = null;
    
            if (req.files['image'] && req.files['image'].length > 0) {
                imagePath = '/uploads/images/' + req.files['image'][0].filename;
            }
    
            // Trouvez et mettez à jour la sous-catégorie
            await sousCategorieModel.findByIdAndUpdate(sousCategorieId, {
                name: name,
                categorie: categorieId,
                description: description,
                image: imagePath ? imagePath : sousCategorie.image
            });
    
            res.redirect('/dashboard');
    
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la sous-catégorie:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

    deleteSousCategorie: async (req, res) => {
        try {
            const sousCategorieId = req.params.id;
    
            await sousCategorieModel.findByIdAndDelete(sousCategorieId);
    
            res.redirect('/dashboard');
    
        } catch (error) {
            console.error("Erreur lors de la suppression de la sous-catégorie:", error);
            res.status(500).json({ message: "Erreur interne du serveur" });
        }
    },

};

module.exports = sousCategorieController;
