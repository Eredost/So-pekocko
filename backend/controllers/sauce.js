const Sauce = require('../models/Sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(200).json({ message: 'Sauce ajoutée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_TOKEN);
            const userId = decodedToken.userId;

            if (sauce.userId === userId) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(404).json({ error }));
                })
            } else {
                res.status(401).json({ error: 'Identifiant utilisateur invalide !' });
            }
        })
        .catch(error => res.status(404).json({ error }))
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case -1:
                    if (sauce.usersDisliked.indexOf(req.body.userId) === -1) {
                        sauce.usersDisliked.push(req.body.userId);
                    }
                    break;
                case 1:
                    if (sauce.usersLiked.indexOf(req.body.userId) === -1) {
                        sauce.usersLiked.push(req.body.userId);
                    }
                    break;
                case 0:
                    if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId, 1));
                    }
                    if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId, 1));
                    }
                    break;
                default:
                    return res.status(400).json({ error: 'Valeur de like invalide !' });
            }
            sauce.likes = sauce.usersLiked.length;
            sauce.dislikes = sauce.usersDisliked.length;
            sauce.save()
                .then(() => res.status(200).json({ message: 'Compteurs de likes mis à jour !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};
