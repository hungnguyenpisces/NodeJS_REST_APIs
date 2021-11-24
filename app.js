const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const bodyParser = require('body-parser');
const routers = require('./routes/index.js');
const database = require('./config/database.js');
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function () {
	console.log('Server is runing... http://localhost:' + port);
});

database.connect();
routers(app);
