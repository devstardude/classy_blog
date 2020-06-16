const passport = require('passport');

module.exports = (req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
};