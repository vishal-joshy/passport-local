const express = require('express');

const indexController = require('../controller/indexController');

const Router = express.Router();

Router.get('/', indexController.get_index);
Router.get('/sign-up', indexController.get_signup);
Router.get('/log-out', indexController.get_logout);
//Post
Router.post('/sign-up', indexController.post_signup);

Router.post('/log-in', indexController.post_login);

module.exports = Router;
