const mongoose=require('mongoose');

let blogSchema= new mongoose.Schema({
	title:String, 
	img: String,
	cont: String,
	date: {type:Date, default: Date.now},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'user'
		},
		username:String
	},
	comment:[{
			type:mongoose.Schema.Types.ObjectId,
			ref:'comment'
	}]
});
module.exports= mongoose.model("blog", blogSchema);