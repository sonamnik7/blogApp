const express=require('express');
const router=express.Router({mergeParams:true});
const Blog=require('../models/blog');
const User=require('../models/user');
const passport=require('passport');

router.get('/',(req, res) => {
	res.redirect('/index');
});

//auth routes
router.get('/register' , (req, res) =>{
	res.render('register/register');
});
router.post('/register' ,(req, res) =>{ 
	User.register(new User({username:req.body.username, name:req.body.name }), req.body.password, (err, u) =>{
		if(err){ 
			 req.flash("error", err.message);
			 res.redirect('/register');}
		else{
			passport.authenticate('local')(req, res, () =>{
				res.redirect('/index');
			});
		}
	});
});
router.get('/login', (req, res) =>{
	res.render('register/login');
});
router.post('/login', passport.authenticate('local' ,{
	successRedirect:'/index',
	failureRedirect:'/login',
	failureFlash:   "Invalid username or password"
}), (req, res) =>{});

router.get('/logout' , (req,res) =>{
	req.logout();
	res.redirect('/');
});
module.exports=router;