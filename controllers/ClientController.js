require("dotenv").config();


var sousCategorieModel = require('../models/sousCategorie.model');
var categorieModel = require('../models/categorie.model');
const siteModel = require('../models/site.model');

/**
 * Function retourne liste des clients
 * */


exports.getListCategorie = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const categories = await categorieModel.find();
        res.status(200).json(categories);
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ status: 400, message: error.message });
    }
};

exports.getListSousCategorie = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const sousCategories = await sousCategorieModel.find({ categorie: req.params.id }).populate({ path: "categorie" });
        res.status(200).send(sousCategories);
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ status: 400, message: error.message });
    }
};

exports.getListSite = async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
        const sites = await siteModel.find({ sousCategorie: req.params.id }).select({ _id: 1, name: 1, description: 1, image: 1, video: 1, contenu: 1 });
        res.status(200).send(sites);
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ status: 400, message: error.message });
    }
};
