const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	tel:{
		type: String,
		default: ''
	},
	subject:{
		type: String,
		default: ''
	},
	message:{
		type: String,
		default: ''
	},
	viaEmail:{
		type: Boolean,
		default:false
	},
	viaPhone:{
		type: Boolean,
		default:false
	}
},{
	tiemstamps:{}
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedbacks;

