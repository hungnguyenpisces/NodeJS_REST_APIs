const employees = require('./employees.js');
const customers = require('./customers.js');
const users = require('./users.js');

function routers(app) {
	app.use('/employees', employees);
	app.use('/customers', customers);
	app.use('/users', users);
}

module.exports = routers;
