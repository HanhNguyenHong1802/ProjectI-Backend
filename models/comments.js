const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	rating: {
		type: Number,
		min: 0,
		max: 5,
		required: true
	},
	content: {
		type: String,
		default: ''
	},
	author:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	drink:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Drink'
	}
},{
	tiemstamps:{}
});

var Comments = mongoose.model('Comment', commentSchema);
module.exports = Comments;

