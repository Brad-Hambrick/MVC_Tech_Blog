const router = require('express').Router();
const withAuth = require('../../utils/auth');
const {User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {

    Post.findAll({
        attributes: ['id', 'title', 'created_at', 'post_content'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    }) .then(postData => res.json(postData))
    .catch(err=> {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'created_at', 'post_content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }

            }
        ]
    }) .then(postData => {
        if (!postData) {
            res.status(400).json({message: 'No post located with that ID'});
            return;
        }
        res.json(postData);
    }) .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_content: req.body.post_content,
        user_id: req.session.user_id
    }) .then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_content: req.body.post_content
    },
    {
        where: {
            id: req.params.id
        }
    }) .then(postData => {
        if(!postData) {
            res.status(400).json({message: 'No post located with that ID'});
            return;
        }
        res.json(postData);
    }) .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }) .then (postData => {
        if(!postData) {
            res.status(400).json({message: 'No Post located with that ID'});
        }
        res.json(postData);
    }) .catch(err => {
        console.logf(err);
        res.status(500).json(err);
    });
});

module.exports = router;