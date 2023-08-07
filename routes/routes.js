const router = require('express').Router();
const userController = require('../controllers/user.controller');
const appUserController = require('../controllers/appUser.controller');
const categorieController = require('../controllers/categorie.controller');
const sousCategorieController = require('../controllers/sousCategorie.controller');
const categorieModel = require('../models/categorie.model');
const sousCategorieModel = require('../models/sousCategorie.model');
const siteModel = require('../models/site.model');
const upload = require('../index');
const siteController = require('../controllers/site.controller');
const moment = require('moment');
moment.locale('fr');
//html decode

const decode = require('decode-html');

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/dashboard', async (req, res) => {
    try {
        const users = await appUserController.getAllAppUsers();
        const categories = await categorieController.getAllCategories();
        const sousCategories = await sousCategorieController.getAllSousCategories();

        res.render('partials/dashboard', { users: users, categories: categories, sousCategories: sousCategories, title: 'Dashboard' });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).send("Erreur interne du serveur");
    }
});

router.get('/authentification', (req, res) => {
    res.render('authentification/login', { title: 'Login' });
});

// application android api authentification

router.get('/logout', appUserController.logout);
router.get('/refresh_token', appUserController.refreshToken);
router.get('/api/info/:id', appUserController.getUser);

// application plateforme api authentification
router.post('/loginAdmin', userController.login);
router.post('/registerAdmin', userController.register);
router.get('/logoutAdmin', userController.logout);
router.get('/refresh_tokenAdmin', userController.refreshToken);

router.get('/infoAdmin', router.get('/infoAdmin', (req, res) => {
    userController.getUser();
})
);


//++++++++++++++++++ API Client ++++++++++++++++++++++++
router.post('/api/login', appUserController.login);
router.post('/api/register', appUserController.register);
router.put('/api/update/:id', appUserController.update);

router.get('/api/getAllCategories', categorieController.getAllCategories);
router.get('/api/getAllSousCategories/:id', sousCategorieController.getAllSousCategoriesByCategorie);
router.get('/api/getAllSites/:id', siteController.getAllSites);
router.get('/api/getSite/:id', siteController.getSite);


//+++++++++++++++++categories routes

router.post('/api/addCategories', categorieController.addCategorie);


router.get('/categories/:categorieName', async (req, res) => {
    const categorieName = req.params.categorieName;

    const categorie = await categorieModel.findOne({ name: categorieName });
    if (!categorie) {
        return res.status(404).send("Catégorie introuvable");
    }
    
    const sousCategories = await sousCategorieModel.find({ categorie: categorie._id });
    const categories = await categorieController.getAllCategories();

    res.render('partials/regions', { sousCategories: sousCategories, categories: categories, categorieName: categorieName, title: 'Sous-catégories' });
});


//+++++++++++++++++sous categories routes
router.post('/api/addSousCategories',  upload.single('image'), sousCategorieController.addSousCategorie);
router.get('/api/getAllSousCategories', sousCategorieController.getAllSousCategories);

router.get('/api/getSousCategorie/:id', sousCategorieController.getSousCategorie);


router.get('/sous-categorie/:sousCategorieName', async (req, res) => {
    const sousCategorieName = req.params.sousCategorieName;

    const sousCategorie = await sousCategorieModel.findOne({ name: sousCategorieName });
    if (!sousCategorie) {
        return res.status(404).send("Sous-catégorie introuvable");
    }

    const sitesTouristiques = await siteModel.find({ sousCategorie: sousCategorie._id });
    const sousCategories = await sousCategorieController.getAllSousCategories();
    const categories = await categorieController.getAllCategories();

    res.render('partials/sites', { sites: sitesTouristiques, sousCategories: sousCategories, sousCategorie: sousCategorie, categories: categories, sousCategorieName: sousCategorieName, title: 'Sites' });
});


//+++++++++++++++++++++++sites touristiques routes
router.post('/api/addSite', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), siteController.addSite);

router.get('/site/:siteName', async (req, res) => {
    const siteName = req.params.siteName;

    const sousCategories = await sousCategorieController.getAllSousCategories();
    const categories = await categorieController.getAllCategories();

    const sites = await siteModel.find({ name: siteName });

    res.render('partials/description', { sites: sites ,sousCategories: sousCategories, categories: categories, moment: moment, decode: decode, title: 'Site' });

});

module.exports = router;
