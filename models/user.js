//blogapp

const mongoose=require('mongoose');
const passportLocalMongoose =require('passport-local-mongoose');

let userSchema= new mongoose.Schema({
	name:String,
	username:String, 
	password:String,
	age:Number,
	Gender:String,
	about:{type:String, default:"Just another user"},
	image: {type:String, default:"https://image.flaticon.com/icons/png/512/16/16363.png"},
  	joined: { type: Date, default: Date.now }
});
userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("user", userSchema);
