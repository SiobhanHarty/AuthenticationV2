var express = require('express');
var router = express.Router();
var passport = require('passport');
var strategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var uuidv1 = require('uuid/v1');

var uid = '';
//Registration End Point
router.post( '/register', function( req, res )
{

  console.log( req.body );

    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2

    var message = {};
    var status = 401;

    console.log( name + ' : ' + username + ' : ' + email + ' : ' + password + ' : ' + password2 );

    // Validation
    req.checkBody('name', 'First Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if( !errors )
    {

      console.log('No Errors Found');
      //Check if user exists
      User.findOne({username:{
          "$regex": "^" + username + "\\b", "$options": "i"}} , function( err, user ){

                  if( !user ) //user exists
                  {
                    console.log( "AOK" );
                    uid = uuidv1();
                    var newUser = new User({
						        name: name,
						        email: email,
                    encryptedEmail: email,
						        username: username,
                    uid: uid,
						        password: password,


					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});

                    status = 201;
                    message = {'message':'user-created','uid':uid};
                    res.status(201).send( message );
                  }
                  else {
                    status = 200;
                    message = {'message':'user-exists'};
                    res.status(200).send( message );
                  }
          });

    }
    else
    {
        status = 200;
        message = errors;
        res.status(status).send( message );
    }

});


module.exports = router;
