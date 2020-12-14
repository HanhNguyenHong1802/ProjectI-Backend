const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	nickname: {
		type: String,
		default: ''
	},
	firstname: {
		type: String,
		default: ''
	},
	lastname:{
		type: String,
		default: ''
	},
	email:{
		type: String,
		default: ''
	},
	isAdmin:{
		type: Boolean,
		default:false
	},
},{
	tiemstamps:{}
}, { autoCreate: true});

userSchema.plugin(passportLocalMongoose);
var Users = mongoose.model('User',userSchema)
module.exports = Users;