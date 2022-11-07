const router = require('express').Router();
const withAuth = require('../../utils/auth');
const {User, Post, Comment } = require('../../models');