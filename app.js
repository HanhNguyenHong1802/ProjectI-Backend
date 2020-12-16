const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors'); // addition we make
const fileUpload = require('express-fileupload'); //addition we make

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const menuRouter = require('./routes/menu');
const commentsRouter = require('./routes/comments');
const membersRouter = require('./routes/members');
const feedbacksRouter = require('./routes/feedbacks');

const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true ,});

connect.then((db) => {
    console.log("Connected to the database.");
}, (err) => { console.log(err); });


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://hanh-nh_18:123321@cluster0.vyhic.mongodb.net/hanh-nh_18?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("users");
//   // perform actions on the collection object
//   console.log(collection)
//   client.close();
// });

require('./seed')


var app = express();

// view engine setup 
//(khởi tạo và thiết lập công cụ hỗ trợ cho việc kết nối, điều hướng và truy xuất đến cơ sở dữ liệu MongoDB )
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');// gọi ra các mẫu được định nghĩa sẵn trong những thư mục jade,
//trong quá trình chạy những file .jade sẽ gọi đến dữ liệu để thay thế vào những biến trong mẫu sẵn,
//sau đó trả về dạng HTML lên front-end cho người dùng
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
// Use CORS and File Upload modules here
app.use(cors());
app.use(fileUpload());

app.use('/', indexRouter);                    //Dùng CORS và những routers (định tuyến)
app.use('/users', usersRouter);               //từ thư mục routes để điều hướng,  
app.use('/menu', menuRouter);                 //đưa dư liệu từ các tệp trong thư mục model
app.use('/members', membersRouter);           //lên server 
app.use('/comments', commentsRouter);
app.use('/feedbacks', feedbacksRouter);

// catch 404 and forward to error handler (xử lý lỗi nếu không kết nối được với database)
app.use(function(req, res, next) {
  next(createError(404));
});
app.use('/public', express.static(__dirname + '/public'));
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
