const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');

const index_get = (req, res, next) => {
	res.render('index');
};
const user_form_get = (req, res, next) => {
	res.render('sign-up');
};
const user_form_post = [
	body('username', 'User Name required').trim().isLength({ min: 1 }).escape(),
	body('password', 'Password required').trim().isLength({ min: 1 }).escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		const newUser = new User({
			name: req.body.username,
			password: req.body.password,
		});
		console.log(newUser, errors);

		if (!errors.isEmpty()) {
			// res.render('sign-up', { details: newUser, errors: errors.array() });
			return;
		} else {
			User.findOne({ name: req.body.name }).exec((err, found_user) => {
				if (err) {
					return next(err);
				}
				if (found_user) {
					console.log('user exists');
				} else {
					newUser
						.save()
						.then(() => {
							console.log('user saved to db');
							res.redirect('/');
						})
						.catch((err) => {
							console.log(err);
						});
				}
			});
		}
	},
];

module.exports = { index_get, user_form_post, user_form_get };
