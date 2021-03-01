var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('./cors');
var authenticate = require('./authenticate')

var Drinks = require('../models/drinks')
var router = express.Router();

router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req,res) => {res.sendStatus(200);})

router.route('/')
.get(cors.cors, async (req, res, next) =>{
	try{
		drinks = await Drinks.find(req.query).populate('comments.author');
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(drinks);
	}
    catch(err) {
        next(err);
    }
})
.post(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	if (req.body != null) {
		try {
			drink = await Drinks.create(req.body)
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(drink);  
			console.log('Successfully created the new drink: '+drink);  
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
		result = await Drinks.remove({});
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(result);
		console.log(result);  	
	} 
	catch(err){
		next(err);
	}
});




router.route('/:drinkId')
.get(cors.cors, async (req, res, next) =>{	
	try{
		drink = await Drinks.findById(req.params.drinkId).populate('comments.author');
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(drink);
	}
    catch(err) {
        next(err);
    }
})
.put(cors.corsWithOptions, authenticate.checkUser, authenticate.checkAdmin, async (req, res, next) =>{
	if (req.body != null) {
		try {
			drink = await Drinks.findByIdAndUpdate(req.params.drinkId,{
			              $set: req.body}, {new : false})
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(drink);  
			console.log('Successfully updated the drink: '+drink);  
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
		drink = await Drinks.findByIdAndRemove(req.params.drinkId);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(drink);
		console.log('The drink: '+drink+' has been deleted');  	 	
	} 
	catch(err){
		next(err);
	}
});

module.exports = router
