import { set } from 'mongoose';
set("strictQuaery", true);
set("useCreateIndex", true);

// Path: server/config/database.js
import { connect } from 'mongoose';
connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection établie avec la base de donnée"))
    .catch(err => console.log("Erreur de connection avec la base de donnée", err));
