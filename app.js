const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const indexRouter = require('./routes/indexRouter');
const User = require('./models/userModel');

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

//routes
app.use(indexRouter);

app.use((err, req, res, next) => {
	console.log(err);
});

app.listen(3000, () => {
	console.log('server running at port 3000');
});
