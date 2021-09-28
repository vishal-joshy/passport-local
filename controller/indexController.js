const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const get_index = (req, res) => res.render('index', { user: req.user });
const get_signup = (req, res) => res.render('sign-up-form');
const get_logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

const post_signup = (req, res) => {
	console.log('response body', req.body);
	bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
		if (err) {
			return next(err);
		}
		const newUser = new User({ username: req.body.username, password: hashedPassword }).save(
			(err) => {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			}
		);
	});
};
const post_login = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true,
});

module.exports = { get_index, get_signup, get_logout, post_signup, post_login };
