const mongoose=require('mongoose');

let commentSchema= new mongoose.Schema({
	text: String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'user'
		},
		username:String
	},
	date: {type:Date, default: Date.now}
});
module.exports= mongoose.model("comment", commentSchema);