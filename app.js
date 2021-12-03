const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const swaggerUIExpress = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerYAML = YAML.load('./swagger.yaml');

// const mongoose = require('mongoose');
// mongoose.set('debug', true);

const {
	AppError,
	handleError,
	handleErrors,
} = require('./utils/errorshandle.js');

const router = require('./routes/index.js');
const database = require('./config/database.js');

const morgan = require('morgan');
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
database.connect();
app.use(router);

app.listen(port, function () {
	console.log('Server is runing... http://localhost:' + port);
});
app.use('/docs', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerYAML)); // using YAML

app.all('*', function (req, res) {
	throw new AppError('URL Not found', 404);
});

app.use(errors());
app.use(handleErrors);
