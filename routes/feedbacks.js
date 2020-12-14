var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('./cors');
var authenticate = require('./authenticate')

var Feedbacks = require('../models/feedbacks')
var router = express.Router();

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req,res) => {res.sendStatus(200);})

router.route('/')
.get(cors.cors, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	try{
		feedbacks = await Feedbacks.find(req.query);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(feedbacks);
	}
    catch(err) {
        next(err);
    }
})
.post(cors.corsWithOptions, async (req, res, next) =>{
	if (req.body != null) {
		try {
			feedback = await Feedbacks.create(req.body)
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(feedback);  
			console.log('Successfully created the new feedback: '+feedback);  
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
		result = await Feedbacks.remove({});
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(result);
		console.log(result);  	
	} 
	catch(err){
		next(err);
	}
});




router.route('/:feedbackId')
.get(cors.cors, authenticate.checkUser, authenticate.checkAdmin, async(req, res, next) =>{
	try{
		feedback = await Feedbacks.findById(req.params.feedbackId);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(feedback);
	}
    catch(err) {
        next(err);
    }
})
.delete(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	try {
		feedback = await Feedbacks.findByIdAndRemove(req.params.feedbackId);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(feedback);
		console.log('The feedback: '+feedback+' has been deleted');  	 	
	} 
	catch(err){
		next(err);
	}
});

module.exports = router
