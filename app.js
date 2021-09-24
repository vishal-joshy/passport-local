const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: false }));

//set view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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

//model
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

//routes
app.get('/', (req, res, next) => {
	res.render('index');
});
app.get('/sign-up', (req, res, next) => {
	res.render('sign-up');
});
app.post('/', (req, res, next) => {
	const newUser = new User({
		name: req.body.username,
		password: req.body.password,
	});
	console.log(newUser);
	res.redirect('/');
});

app.use((err, req, res, next) => {
	console.log(err);
});

app.listen(3000, () => {
	console.log('server running at port 3000');
});
