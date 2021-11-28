const express=require('express'),
	  router=express.Router({mergeParams:true}),
	  Blog=require('../models/blog'),
	  Comment=require('../models/comment'),
	  middleware=require('../middleware');



router.post('/',middleware.isLoggedIn,(req, res) =>{
	//eval(require('locus'));
	Blog.findById(req.params.id, (err,b ) =>{
		if(err || !b){
			req.flash("error","No such Blog found");
			res.redirect('/index/'+req.params.id)
		}
		Comment.create(req.body.comment, (e, c) =>{
			if(e){
				req.flash("error","Can't create comment");
				res.redirect('/index/'+req.params.id);
			}else{
			c.author.username=req.user.username;
			c.author.id=req.user._id;
			c.save();
			b.comment.push(c);
			b.save();
			return res.redirect('/index/'+req.params.id); }
		});
	});
});
router.get('/:comment_id/edit',middleware.isCommentAuthor, (req, res) =>{
	Blog.findById(req.params.id, (e, bg) =>{
		if(e || !bg){
			req.flash("error","No such Blog found");;
			return res .redirect('/index/'+req.params.id);
		}else{
			Comment.findById(req.params.comment_id, (err, c) =>{
				if(err || !c){
					req.flash("error","Can't edit comment");
					res.redirect("back");
				}
				else
					res.render('comment/edit',{bg_id:req.params.id, comment:c});
			});
		}
	});
});
router.put("/:comment_id",middleware.isCommentAuthor, (req, res) =>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, c)=>{
		if(err|| !c)
			res.redirect('back');
		else
			res.redirect('/index/'+req.params.id);
	});
});
router.delete("/:comment_id", middleware.isCommentAuthor, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err, c) =>{
		if(err || !c)
			res.redirect('back');
		else
			res.redirect("/index/"+req.params.id);
	});
	
});
module.exports= router;
