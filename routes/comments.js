var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('./cors');
var authenticate = require('./authenticate')

var Comments = require('../models/comments')
var router = express.Router();

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req,res) => {res.sendStatus(200);})

router.route('/')
.get(cors.cors, async (req, res, next) =>{
	try{
		cmts = await Comments.find(req.query).populate('author');
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(cmts);
	}
    catch(err) {
        next(err);
    }
})
.post(cors.corsWithOptions, authenticate.checkUser, async (req, res, next) =>{
	if (req.body != null) {
		try {
			req.body.author  = req.user._id;
			cmt = await Comments.create(req.body);
			cmt = await Comments.findById(cmt._id).populate('author');
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(cmt);  
			console.log('Successfully created the new comment: '+cmt);  
		}
		catch(err){
			next(err);
		}
	} else {
		err = new Error('The request body is empty.');
		err.status = 404;
		next(err);
	}
})
.delete(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	try {
		result = await Comments.remove({});
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(result);
		console.log(result);  	
	} 
	catch(err){
		next(err);
	}
});




router.route('/:commentId')
.get(cors.cors, async (req, res, next) =>{
	try{
		cmt = await Comments.findById(req.params.commentId).populate('author');
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(cmt);
	}
    catch(err) {
        next(err);
    }
})
.put(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	if (req.body != null) {
		try {
			cmt = await Comments.findById(req.params.commentId);
			if(cmt != null){
				if(!cmt.author.equals(req.user._id)) {
					err = new Error('You can not modify others\' comments.');
					err.status = 403;
					next(err);
				}
				req.body.author = req.user._id;
				cmt = await Comments.findByIdAndUpdate(req.params.commentId, {
							$set: req.body},{ new:true }).exec();
				cmt = await Comments.findById(cmt._id).populate('author')
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(cmt);  
				console.log('Successfully updated the comment: '+cmt);  						
			}	
			else {
                err = new Error('Comment '+ req.params.commentId+' does not exist.');
                err.status = 404;
                next(err);
			}
		}
		catch(err){
			next(err);
		}
	} else {
		err = new Error('The request body is empty.');
		err.status = 404;
		next(err);
	}
})
.delete(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	try {
		cmt = await Comments.findByIdAndRemove(req.params.commentId)
		if (cmt) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(cmt);  
			console.log('The comment: '+cmt+' has been deleted');  						
		}
	} 
	catch(err){
		next(err);
	}
});

module.exports = router
