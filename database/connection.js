const mongoose = require("mongoose"); 


const url_mongo = "mongodb+srv://nico:nictourisme@tourisme-db.mov7gpk.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => {
            console.error('Error connecting to mongo', err);
        });
    }catch(err){
        process.exit(1);
    }
}

module.exports = connectDB;