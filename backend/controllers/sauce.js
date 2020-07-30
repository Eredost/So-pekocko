const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    res.status(200);
};

exports.modifySauce = (req, res, next) => {
    res.status(200);
};

exports.deleteSauce = (req, res, next) => {
    res.status(200);
};

exports.likeSauce = (req, res, next) => {
    res.status(200);
};
