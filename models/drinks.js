const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drinkSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	type: {
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
	},
	recommended:{
		type: Boolean,
		default:false
	}
},{
	tiemstamps:{}
});

var Drinks = mongoose.model('Drink',drinkSchema);
module.exports = Drinks;

