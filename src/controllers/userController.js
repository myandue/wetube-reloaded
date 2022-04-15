import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../models/Video";

export const getJoin = (req, res) => {
    res.render("join",{pageTitle: "Join"});
}
export const postJoin = async(req, res) => {
    const {name, email, username, password, password2, location} = req.body;
    const exist = await User.exists({$or: [{username}, {email}]});
    if(exist){
        return res.status(400).render("join",{pageTitle: "Join", errorMessage: "This email/username is already taken."});
    }
    if(password !== password2){
        return res.status(400).render("join",{pageTitle: "Join", errorMessage: "Password confirmation does not match."});
    }
    try{
        await User.create({
        name, email, username, password, location,
    });
    return res.redirect("/login");
    } catch(error){
        return res.status(400).render("join",{pageTitle: "Join", errorMessage: error._message});
    }
    
}
export const getLogin = (req, res) => {
    res.render("login",{pageTitle: "Log In"});
};
export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const pageTitle= "Log In";
    const user = await User.findOne({username, socialOnly:false});
    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username does not exist."});
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).render("login", {pageTitle, errorMessage: "Wrong password!"});
    }
    //로그인이 됐다면, req.session object에 loggedIn, user 항목을 생성해 넣어줌 
    //각각 true 값과, 내가 db에서 findOne해서 찾은 user 데이터를 넣어줌 
    req.session.loggedIn = true;
    req.session.user = user;
    //위와 같이 session에 넣어줌으로써, req.session.user를 controller 어디서나 사용할 수 있는 것.
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseURL = "https://github.com/login/oauth/authorize";
    const config = {
        client_id:process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    return res.redirect(finalURL);
}

export const finishGithubLogin = async(req, res) => {
    const baseURL="https://github.com/login/oauth/access_token";
    const config={
        client_id:process.env.GH_CLIENT,
        client_secret:process.env.GH_SECRET,
        code:req.query.code,
    }
    const params=new URLSearchParams(config).toString();
    const finalURL=`${baseURL}?${params}`;
    const tokenRequest = await (await fetch(finalURL,{
        method:"POST",
        headers:{
            Accept:"application/json",
        },
    })).json();
    if("access_token" in tokenRequest){
        const {access_token}=tokenRequest;
        const apiURL = "https://api.github.com";
        const userData = await(await fetch(`${apiURL}/user`,{
            headers:{
                Authorization:`token ${access_token}`,
            }
        })).json();
        const emailData = await(await fetch(`${apiURL}/user/emails`,{
            headers:{
                Authorization:`token ${access_token}`,
            }
        })).json();
        const emailObj = emailData.find(
            (email)=>email.primary===true&&email.verified===true
        );
        if(!emailObj){
            return res.redirect("/login");
        }else{
            let user = await User.findOne({email:emailObj.email});
            if(!user){
                user = await User.create({
                    avatarURL:userData.avatar_url,
                    name:userData.name, 
                    email:emailObj.email, 
                    password:"",
                    username:userData.login, 
                    location:userData.location,
                    socialOnly:true
                })
            }
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    }else{
        return res.redirect("/login");
    }
}

export const getEdit = (req, res) => {
    return res.render("edit-profile",{pageTitle:"Edit Profile"});
}
export const postEdit = async(req, res) => {
    const{
        session:{
            user:{_id, avatarURL},
        },
        body:{
            name,
            email,
            username,
            location
        },
        file
    } = req;
    if(email!==req.session.user.email){
        const exists = await User.exists({email});
        if(exists){
            return res.status(400).render("edit-profile",{pageTitle:"Edit Profile", errorMessage: "This email is already taken."});
        }
    }
    if(username!==req.session.user.username){
        const exists = await User.exists({username});
        if(exists){
            return res.status(400).render("edit-profile",{pageTitle:"Edit Profile", errorMessage: "This username is already taken."});
        }
    }
    const updatedUser = await User.findByIdAndUpdate(_id,{
        avatarURL : file ? file.path : avatarURL,
        name, email, username, location
    },{new:true});
    req.session.user=updatedUser;
    return res.redirect("/users/edit");
}

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly){
        return res.redirect("/");
    }
    return res.render("user/change-password", {pageTitle:"Change Password"});
}
export const postChangePassword = async(req, res) => {
    const {
        session:{
            user:{_id},
        },
        body:{
            oldPassword, password1, password2
        }
    }=req;
    const user = await User.findById(_id);
    if(password1!==password2){
        return res.status(400).render("user/change-password",{pageTitle: "Change Password", errorMessage: "Password confirmation does not match."});
    }
    const match = await bcrypt.compare(oldPassword,user.password);
    if(!match){
        return res.status(400).render("user/change-password",{pageTitle: "Change Password", errorMessage: "The password is incorrect."});
    }
    user.password=password1;
    //save를 하기 전에 hash가 적용되기 때문에 user.save() 과정이 필요함 
    await user.save();
    return res.redirect("/users/logout");
}

export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => {
    //세션을 없앰
    req.session.destroy();
    return res.redirect("/");
}
export const see = async(req, res) => {
    const {id}=req.params;
    const user = await User.findById(id).populate(
        {
            path:"videos",
            populate:{
                path:"owner",
                model:"User",
            }
        }
    );
    if(!user){
        return res.status(404).render("404", {pageTitle:"User not found"});
    }
    const videos = await Video.find({owner:user._id});
    return res.render("profile",{pageTitle:user.name, user});
}