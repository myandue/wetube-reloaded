import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required:true, unique:true,},
    socialOnly:{type:Boolean, default: false},
    avatarURL:String,
    username: { type: String, required:true, unique:true,},
    password: {type:String},
    name: {type:String},
    location: String,
    comments:[{type:mongoose.Schema.Types.ObjectId, required:true, ref:"Comment"}],
    videos:[{type:mongoose.Schema.Types.ObjectId, ref:"Video"}],
})

userSchema.pre("save", async function(){
    //password가 수정됐을 때에만 hash 발생함 
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 5);}
 })

const User = mongoose.model("User", userSchema);
export default User;