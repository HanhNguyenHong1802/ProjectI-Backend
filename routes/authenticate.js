var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var Users = require('../models/users');
var config = require('../config.js');

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("jwt payload: ", jwt_payload);
        Users.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
 }));

exports.getToken = function(userId) {
    return jwt.sign(userId, config.secretKey, {expiresIn: 1800});
};

exports.checkUser = passport.authenticate('jwt', {session: false});

exports.checkAdmin = function(req,res,next) {
  if (req.user.isAdmin){next();}
  else{
    err = new Error('Only admins are authorized to perform the operation.');
    err.status = 403;
    return next(err);
  }
}

