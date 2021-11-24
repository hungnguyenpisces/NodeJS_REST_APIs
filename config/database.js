const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect('mongodb://localhost:27017/nodejs_mongodb_dev', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('MongoDB: database connected.');
	} catch (error) {
		console.log(error);
	}
}

module.exports = { connect };
