
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
// middleware to access files
app.use(express.static('public'));

// middleware to decode data that come from browser and store in req.body
app.use(express.json());

// remove cors policy while using in browser
app.use(cors());
app.use(morgan('tiny'));

const dbName = 'e_commerce_db';

const globalDbUri = process.env.GLOBAL_MONGODB_URI;  // uri for storing data in Mongodb cluster
const localDbUri = `mongodb://127.0.0.1:27017/${dbName}`;  // uri for storing data locally


// for storing data locally
function connectDbLocally(){
    mongoose.connect(localDbUri)
    .then(console.log(`Database is connected as ${dbName} locally.`))
    .catch((err) => console.log(`Failed to connect database. Error message: ${err}`));
}


// mongodb globally connection
mongoose.connect(globalDbUri)
    .then(() => console.log(`Database is connected successfully globally to ${globalDbUri}.`))
    .catch((err) => console.log(`Failied to connect database. Error message : ${err.message}`));



module.exports = app;