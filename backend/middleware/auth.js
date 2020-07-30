const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'lyHPzb4Tfn619dQF47GiWEItn7Ky');
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant utilisateur invalide !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
};
