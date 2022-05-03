import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title:{type:String, required:true, trim: true, max:80,},
    fileUrl:{type:String, required:true},
    thumbUrl:{type:String, required:true},
    description:{type:String, required:true, trim: true, min:20,},
    createdAt:{type:Date, default:Date.now,},
    hashtags:[{type:String, trim: true,}],
    meta:{
        views:{type:Number, default:0},
        rating:{type:Number, default:0},
    },
    owner:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
});

//split(",") => 해쉬태그를 하나만 달때(즉 쉼표가 없을때) 문제 되는듯 
videoSchema.static("formatHashtags", function(hashtags){
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;