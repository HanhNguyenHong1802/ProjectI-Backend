const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email:{
		type: String,
		default: ''
	},
	tel:{
		type: String,
		default: ''
	},
	description:{
		type: String,
		default: ''
	},
	image:{
		type: String,
		required: true
	}
},{
	tiemstamps:{}
});

var Members = mongoose.model('Member',memberSchema);
module.exports = Members;

