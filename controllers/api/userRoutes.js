const router = require('express').Router();
const withAuth = require('../../utils/auth');
const {User, Post, Comment } = require('../../models');
const { use } = require('./postRoutes');


router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password']}
    }) .then(userData => res.json(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    }) .then(userData => {
        if(!userData) {
            res.status(400).json({message: 'No user located with that ID'});
            return;
        }
        res.json(userData);
    }) .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
        username: req.params.username,
        email: req.body.email,
        password: req.body.password
    }) .then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.email = userData.email;
            res.session.loggedIn = true;
            res.json(userData);
        });
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }) .then(userData => {
        if(!userData) {
            res.status(400).json({message: 'No user located with that username'});
            return;
        }
        const correctPw = userData.checkPassword(req.body.password);

        if(!correctPw) {
            res.status(400).json({message: 'That password is Incorrect'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json({ user: userData, message: 'You are logged In'});
        });
    });
});

router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }) .then (userData => {
        if(!userData) {
            res.status(400).json({message: 'No user located with that ID'});
            return;
        }
        res.json(userData);
    }) .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
