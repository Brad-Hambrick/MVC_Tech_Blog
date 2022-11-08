const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/signup', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/')
        return;
    }
})

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: [
                    {
                        model: User, 
                        attributes: ['username']
                    }
                ]
            }
        ]
    }) .then(homeData => {
        const posts = homeData.map(post.get({ plain: true }));
        res.render('homepage', {
            post, loggedIn: req.session.loggedIn
        });
    }) .catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => { 
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'posted_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: [
                    {
                        model: User, 
                        attributes: ['username']
                    }
                ]
            }
        ]
    }) .then(homeData => {
        if(!homeData) {
            res.status(404).json({message: 'There was no post found with that ID'});
            return;
        }
        const posts = homeData.get({ plain: true});

        res.render('single-post', {
            post, loggedIn: req.session.loggedIn
        });
    }) .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;