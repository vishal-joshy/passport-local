const express = require('express');
const indexController = require('../controllers/indexController');

const Router = express.Router();

Router.get('/', indexController.index_get);
Router.post('/user-form', indexController.user_form_post);
Router.get('/user-form', indexController.user_form_get);

module.exports = Router;
