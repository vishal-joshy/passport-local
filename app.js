const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/userModel');

require('dotenv').config();

//db connection
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xv49z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
	.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => {
		console.log('DB connected');
	})
	.catch((err) => {
		console.log(err);
	});

//express app

const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

//passport
passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' });
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					// passwords match! log user in
					return done(null, user);
				} else {
					// passwords do not match!
					return done(null, false, { message: 'Incorrect password' });
				}
			});
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});
//passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//set view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//routes
//get
app.get('/', (req, res) => res.render('index', { user: req.user }));
app.get('/sign-up', (req, res) => {
	res.render('sign-up-form');
});
app.get('/log-out', (req, res) => {
	req.logout();
	res.redirect('/');
});
//Post
app.post('/sign-up', async (req, res) => {
	console.log('response body', req.body);
	const encryptedPass = await bcrypt.hash(req.body.password, 10);
	const newUser = new User({ username: req.body.username, password: encryptedPass }).save((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
});

app.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/',
	})
);

//error handling
app.use((err, req, res, next) => {
	console.log(err);
});

app.listen(3000, () => {
	console.log('server running at port 3000');
});
