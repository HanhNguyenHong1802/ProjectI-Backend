var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('./cors');
var authenticate = require('./authenticate')

var Members = require('../models/members')
var router = express.Router();

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions,  (req,res) => {res.sendStatus(200);})

router.route('/')
.get(cors.cors, async (req, res, next) =>{
	try{
		members = await Members.find(req.query);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(members);
	}
    catch(err) {
        next(err);
    }
})
.post(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	if (req.body != null) {
		try {
			member = await Members.create(req.body)
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(member);  
			console.log('Successfully created the new member: ',member);  
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
		result = await Members.remove({});
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(result);
		console.log(result);  	
	} 
	catch(err){
		next(err);
	}
});




router.route('/:memberId')
.get(cors.cors, async (req, res, next) =>{
	try{
		member = await Members.findById(req.params.memberId);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(member);
	}
    catch(err) {
        next(err);
    }
})
.put(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	if (req.body != null) {
		try {
			member = await Members.findByIdAndUpdate(req.params.memberId,{
							$set: req.body}, {new:true})
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(member);  
			console.log('Successfully updated the new member: ',member);  
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
		result = await Members.findByIdAndRemove(req.params.memberId);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(result);
		console.log(result);  	
	} 
	catch(err){
		next(err);
	}
});

module.exports = router
