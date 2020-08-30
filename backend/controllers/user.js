const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

exports.signup = (req, res, next) => {
    try {
        // Checks if the password is 8 characters long and contains a lowercase, an uppercase, a number and a special character
        if (!/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(req.body.password)) {
            throw 'Complexité du mot de passe insuffisante';
        }

        // Hash the user's password
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({error}));
            })
            .catch(error => res.status(500).json({ error }));
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // Checks if the searched user exists
            if (!user) {
                return res.status(401).json({ error: 'Email introuvable !' })
            }

            // Compare the password of the recovered user with the password entered in the login form
            bcrypt.compare(req.body.password, user.password)
                .then(isValid => {
                    if (!isValid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({ message: error }));
};
