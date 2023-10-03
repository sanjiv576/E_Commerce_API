
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const user_routes = require('./routes/user_routes');

const app = express();
// middleware to access files
app.use(express.static('public/'));

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

// connectDbLocally();


// mongodb globally connection
mongoose.connect(globalDbUri)
    .then(() => console.log(`Database is connected successfully globally to ${globalDbUri}.`))
    .catch((err) => console.log(`Failied to connect database. Error message : ${err.message}`));

// testing 
app.get('/', (req, res) => {
    res.send('<h1>Testing</h1>');
});


// routes for users
app.use('/users', user_routes);

// error handling middlewares
app.use((req, res, next, err) => {

    if (err.name === 'ValidationError') return res.status(400);
    else if (err.name === 'CastError') return res.status(400);
    else {
        res.json({ error: err.message });
    }
});

// for unknown path
app.use((req, res) => res.status(404).json({ error: 'Path not found' }));



module.exports = app;