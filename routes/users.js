var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('./cors');
var authenticate = require('./authenticate')
var passport = require('passport');
var Users = require('../models/users')
var router = express.Router();

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req,res) => {res.sendStatus(200);})

router.get('/',cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, (req, res, next) =>{
	Users.find({})
	.then((users) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(users);
	})
	.catch((err) =>next(err));
})

router.post('/', cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
    Users.register(new Users({username: req.body.username}), 
    req.body.password, async (err,user) => {
    	if(err) { next(err); }
    	else {
    		try {
		    	user.nickname = req.body.nickname;
		    	user.isAdmin = req.body.isAdmin;
		        if (req.body.email)
		           user.email= req.body.email;
		        if (req.body.firstname)
		           user.firstname = req.body.firstname;
		        if (req.body.lastname)
		           user.lastname = req.body.lastname;
		        var savedUser = await user.save();
		        console.log(savedUser);
		        res.statusCode = 200;
	            res.setHeader('Content-Type', 'application/json');
	            res.json({success: true, status: 'Successfully Added the User!'});
            }
            catch(err) {
                console.log('Error : '+err);
                res.statusCode = 500;
                es.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Failed to Add the User.'});
            }
    	}
    });
});

router.post('/signup', cors.corsWithOptions, async (req, res, next) =>{
    Users.register(new Users({username: req.body.username}), 
    req.body.password, async (err,user) => {
    	if(err) { next(err); }
    	else {
    		try {
		    	user.nickname = req.body.nickname;
		        if (req.body.email)
		           user.email= req.body.email;
		        if (req.body.firstname)
		           user.firstname = req.body.firstname;
		        if (req.body.lastname)
		           user.lastname = req.body.lastname;
		        var savedUser = await user.save();
		        console.log(savedUser);
		        res.statusCode = 200;
	            res.setHeader('Content-Type', 'application/json');
	            res.json({success: true, status: 'Successfully Registered!'});
            }
            catch(err) {
                console.log('Error : '+err);
                res.statusCode = 500;
                es.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Failed to Register.'});
            }
    	}
    });
});

router.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
	if (err) { return next(err); }
	if (!user) { 
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', isAdmin:false, err: info});
	}
	req.logIn(user, function(err) {
		if (err) { return next(err); }
		token = authenticate.getToken({_id: req.user._id});
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: true, status: 'Login Successful!', isAdmin:user.isAdmin, token: token});
	});
	})(req, res, next);
});


router.route('/:userId')
.delete(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	try {
		user = await Users.findByIdAndRemove(req.params.userId);
		if (user){
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(user);
			console.log('The user: '+user+' has been deleted');
		}  	 	
	} 
	catch(err){
		next(err);
	}
});
module.exports = router;



