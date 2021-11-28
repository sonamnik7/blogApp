const Blog=require('../models/blog');
const User=require('../models/user');
const Comment=require('../models/comment');
let middlewareObj={};

middlewareObj.isLoggedIn= (req, res, next) =>{
	if(req.isAuthenticated()){
		return next();
	}
	else{
		req.flash('error', 'Please Login first');
		res.redirect('/login');
	}
	
}

 middlewareObj.isAuthor =(req, res, next) =>{
 	if(req.isAuthenticated()){
 		Blog.findById(req.params.id, (e, b) =>{
 			if(e){
				req.flash("error", e.message);
 				res.redirect('back');
			}
 			else{
 				if(!b){
					req.flash("error" , "No such Blog found");
 					res.redirect('/index');
				}
 				else{
					if(req.user._id.equals(b.author.id))
						return next();
 					else{
						req.flash("error","You are not authorized to do that.");
						res.redirect('/index');
					}
 				}
 			}
 		})
 	}
 	else {
		req.flash("error","Please login first");
		res.redirect('/login');}
}
 middlewareObj.isCommentAuthor =(req, res, next) =>{
	Blog.findById(req.params.id, (e, bg) =>{
		if(e || !bg){
			req.flash("error", "No such blog found");
			return res.redirect("back");
		}else{
			if(req.isAuthenticated()){
				Comment.findById(req.params.comment_id ,(err, c) =>{
					if(err || !c){
						req.flash("error","Comment not found");
						res.redirect('back');
					}
					else{
						if(c.author.id.equals(req.user._id))
							return next();
						else{
							req.flash("error","You are not authorized to do that.")
							res.redirect("back");
						}
					}
				});
			}else{
				req.flash("error","Please login first");
				res.redirect("/login");
				}	
			}
	});
}
 middlewareObj.isUser=(req, res, next) =>{
	 if(req.isAuthenticated()){
		// eval(require('locus'));
		if(req.user._id.equals(req.params.id))
			return next();
		 else{
			 req.flash("error","You are not authorized to do that.")
			 res.redirect("back");
		 }
	}
	else{
		req.flash('error', 'Please Login first');
		res.redirect('/login');
	}
 }
module.exports=middlewareObj;