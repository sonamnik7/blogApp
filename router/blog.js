const express=require('express');
const router=express.Router({mergeParams:true});
const Blog=require('../models/blog');
const User=require('../models/user');
const Comment=require('../models/comment');
const middleware=require('../middleware');


router.get('/', (req, res) =>{
	Blog.find({}, (err, blogss) =>{
		if(err || !blogss){
			req.flash("error", "Blogs not found");
			res.send("Site under maintenance");
		}
		else 
			res.render("index/home", {blogs:blogss});	
	});
});
router.get('/new',middleware.isLoggedIn, (req, res) => {
	res.render("index/form");
});
router.post('/',middleware.isLoggedIn,(req, res) =>{
	req.body.blog.cont = req.sanitize(req.body.blog.cont);
	Blog.create(req.body.blog, (err, b) =>{
		if(err){
			req.flash("err","Can't create blog");
			res.render('index/form');
		}
		else{
			b.author.id= req.user._id;
			b.author.username=req.user.username;
			b.save();
		}
	
	});
	res.redirect('/index');
});
router.get('/:id',(req, res) => {
	
	Blog.findById(req.params.id).populate('comment').exec((err, bg) => {
	//	eval(require('locus'));
		if(err || !bg)
		{ req.flash("error","No such Blog found"); 
		 res.redirect('/index');
		}
		else
		res.render("index/show", {blog:bg});
			
	});
});
router.get('/:id/edit',middleware.isAuthor, (req, res) =>{
	Blog.findById(req.params.id, (err, bg) =>{
		if(err || !bg){
			req.flash("error","No such Blog found"); 
			res.redirect('/index/'+req.params.id);
		}
		else
			res.render("index/edit", {bg : bg});
	});
});
router.put('/:id',middleware.isAuthor,(req,res) => {
	req.body.blog.cont = req.sanitize(req.body.blog.cont);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog ,(err, bg) =>{
		if(err || !bg){
			req.flash("error","No such Blog found");
			res.redirect('/index/'+req.params.id);
		}
		else
			res.redirect('/index/'+req.params.id);
	});
});
router.delete('/:id',middleware.isAuthor,(req,res)=>{
	Blog.findByIdAndDelete(req.params.id, req.body.blog ,(err, bg) =>{
		if(err || !bg){
			req.flash("error","No such Blog found");
			res.redirect('/index/'+req.params.id);
		}
		else{
			Comment.deleteMany({_id: {$in: bg.comment}},(err) =>{
				if(err)
					res.redirect("/index");
			});
		}
			res.redirect('/index');
	});
	
});
module.exports=router;