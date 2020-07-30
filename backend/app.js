const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('routes/user');

const app = express();

// Connection to the MongoDB Atlas database
mongoose.connect('mongodb+srv://application:WA4NdFzf3XpoqGTJJZaeiF18nIyl@sopekocko.ok4et.mongodb.net/sopekocko?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuring HTTP Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

module.exports = app;
