const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adventureSchema = new Schema({
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

var adventure = mongoose.model('adventure',adventureSchema);
module.exports = adventure;

