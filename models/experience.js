const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
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
    duration: {
        type: String,
        required: true
    },
	recommended:{
		type: Boolean,
		default:false
	},
    online: {
        type:Boolean,
        default:false
    }
},{
	tiemstamps:{}
});

var experience = mongoose.model('experience',experienceSchema);
module.exports = experience;

