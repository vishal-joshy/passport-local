const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { body, validationResult } = require('express-validator');

const userModel = new Schema({
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model('User', userModel);

module.exports = User;
