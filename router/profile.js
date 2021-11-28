const express=require('express');
const router=express.Router({mergeParams:true});
const Blog=require('../models/blog');
const User=require('../models/user');
const passport=require('passport');
const middleware=require('../middleware');

router.get('/', (req,res) =>{
	User.findById(req.params.id ,(err, u) =>{
		if(err || !u){
			req.flash("error","No such User found"); 
			return res.redirect('/index');	
		}
		else{
			Blog.find().where('author.id').equals(u._id).exec(function(e, b) {
      			if(err) {
        			req.flash("error", "Something went wrong.");
        			return res.redirect("/index");
      			}
      			res.render("user/profile", {user: u, blog: b});
    		});
		}
	});
});

router.get('/edit',middleware.isUser,(req, res) =>{
	User.findById(req.params.id, (err,u) =>{
		if(err || !u){
			req.flash("error","No such User found"); 
			return res.redirect('/index');	
		}
		else{
			res.render('user/edit',{user:u});
		}
	});
});
router.put('/',middleware.isUser,(req, res) =>{
	User.findByIdAndUpdate(req.params.id, req.body.user ,(err, u) =>{
		if(err || !u){
			console.log(err);
			req.flash("error","No such User found");
			res.redirect('/index');
		}
		else
			res.redirect('/profile/'+req.params.id);
	});
});


module.exports=router;