const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/leaveGame/:id', leaveGame);


router.get('/', getAll);
router.get('/:id', getById);

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function authenticate(req, res, next) {
    console.log("req.body ::",req.body)
    userService.authenticate1(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.register(req.body)
        .then(() => res.json({message: 'User created successfully.'}))
        .catch(err => next(err));
}

function leaveGame(req, res, next) {
    userService.leaveGame(req.params.id)
        .then(() => res.json({message: 'Left game successfully.'}))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

module.exports = router; 