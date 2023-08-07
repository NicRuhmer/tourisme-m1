const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const static = require('serve-static');
const session = require('express-session');
const multer = require('multer');

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

require('dotenv').config({ path: './.env' });

app.use(static(path.join(__dirname, 'public')));
app.use('/scss', express.static("public/scss"));
app.use('/img', express.static("assets/img"));
app.use('/css', express.static("public/css"));
app.use('/js', express.static("public/js"));
app.use("/js2", express.static("functions/js"));
app.use('/uploads', express.static('public/uploads'));
// app.use('/public/uploads', express.static('public/uploads'));

app.use(express.static("views"));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
})
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') {
            cb(null, 'public/uploads/images');
        } else if (file.fieldname === 'video') {
            cb(null, 'public/uploads/videos');
        } else {
            cb(new Error('Erreur: Champ de fichier non valide!'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'image') {
            const filetypes = /jpeg|jpg|png|gif/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Erreur: Seuls les formats d'image (jpeg, jpg, png, gif) sont autorisés!");
        } else if (file.fieldname === 'video') {
            const filetypes = /mp4|mpeg|ogg|webm/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb("Erreur: Seuls les formats vidéo (mp4, mpeg, ogg, webm) sont autorisés!");
        }
    }
});

module.exports = upload;

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


//set template engine
app.set('view engine', 'ejs');

//routes prefix
app.use('', require('./routes/routes'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
        console.log('Connection au base de donnée établie');
    })
    .catch(err => console.log(err));

// 



