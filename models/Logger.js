const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logger = new Schema({
	level: { type: String, required: true, enum: ['info', 'warning', 'error'] },
	message: { type: String, required: true },
	user: { type: String, required: true },
	action: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});
const Logger = mongoose.model('Logger', logger);
module.exports = Logger;
