const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne( { email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'Email is not registered!' });
                    }
                    
                    //Match Password
                    bcrypt.compare(password, user.password, (err, isMatched) => {
                        if(err) throw err;

                        if(isMatched) {
                            return done(null, user, { message: 'Password accepted' });
                        }
                        else {
                            return done(null, false, { message: 'Incorrect Password' });
                        }
                    }
                )})
                .catch(err => console.log(err));
        })
    )
    
    //Passport serialize and deserialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}