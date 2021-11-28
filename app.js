const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const {
	AppError,
	handleError,
	handleErrors,
} = require('./utils/errorshandle.js');

const routers = require('./routes/index.js');
const database = require('./config/database.js');

const morgan = require('morgan');
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
database.connect();
routers(app);

app.listen(port, function () {
	console.log('Server is runing... http://localhost:' + port);
});

app.get('/throw', (req, res) => {
	throw new AppError('Random Error!', 404);
});

app.get(
	'/throw-async',
	handleError(async (req, res) => {
		await (async () => {
			throw new Error();
		})();
	})
);

app.all('*', function (req, res) {
	res.status(404).json({
		status: 404,
		message: `URL Not Found`,
	});
});

app.use(errors());
app.use(handleErrors);