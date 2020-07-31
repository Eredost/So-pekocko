const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw 'Token d\'authentification manquant !';
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant utilisateur invalide !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error });
    }
};
