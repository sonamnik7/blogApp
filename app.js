require("dotenv").config();
const express    =require("express"),
	  app        =express(),
      bodyParser =require("body-parser"),
	  mongoose   =require("mongoose"),
	  passport=require('passport'),
	  LocalStrategy=require('passport-local'),
	  passportLocalMongoose=require('passport-local-mongoose'),
	  methodOverride=require("method-override"),
	  expressSanitizer=require("express-sanitizer"),
	  flash=require('connect-flash'),
	  Blog=require('./models/blog'),
	  User=require('./models/user');

const blogRoute=require('./router/blog');
const indexRoute=require('./router/index');
const commentRoute=require('./router/comment');
const profileRoute=require('./router/profile');
//eval(require("locus"));
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
	console.log("connected to db");
	app.listen(process.env.PORT || 3000, () =>{
		console.log("server running");
	});
}).catch(err =>{
    console.log("error", err.message);
});
//mongoose.connect("", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
	secret:'will this work',
	resave:false,
	saveUninitialized:false
}));
//setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	res.locals.currentUser= req.user;
	res.locals.error=req.flash("error");
 	next();
});
 
app.use('/index', blogRoute);
app.use(indexRoute);
app.use('/index/:id/comment', commentRoute);
app.use('/profile/:id', profileRoute);

// app.listen(process.env.PORT || 3000, ()=>{
// 	console.log("server running");
// });