const express = require('express');

const app = express();

// middleware to access files
app.use(express.static('public'));

// middleware to decode data that come from browser and store in req.body
app.use(express.json());

module.exports = app;