const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({                  //Khi khởi tạo new Schemas là lập trình viên 
	rating: {										//đang khởi tạo một khuôn mẫu của collection
		type: Number,								//giống như trong các hệ quản trị cơ sở dữ liệu
		min: 0,										//quan hệ (RDBMS)
		max: 5,
		required: true								
	},												//Một Schema thể hiện các document trong collection 
	content: {										//chỉ định sẽ có cấu trúc như thế nào
		type: String,
		default: ''
	},
	author:{										//Schema chịu trách nhiệm cho việc các collection của 
		type: mongoose.Schema.Types.ObjectId,		//sản phẩm sẽ có hình dạng ra sao, tạo ra các khung  
		ref: 'User'									//khuôn mẫu của dữ liệu, thêm vào đó nó còn cho phép 
	},												//lập trình viên kiểm tra dữ liệu có đúng kiểu vốn có 
	drink:{											//của chúng hay không
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Drink'
	}
},{
	tiemstamps:{}
});

var Comments = mongoose.model('Comment', commentSchema);		//Model là kết quả từ quá trình compile 
module.exports = Comments;										//Schema đã được định nghĩa trước đó.	
																//Một thể hiện của model được gọi là document.
																//Model sẽ chịu trách nhiện chính trong 
																//việc đọc và ghi 
																//dữ liệu trong việc đọc và ghi dữ liệu từ 
																// database MongoDB
																