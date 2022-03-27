import User from "../models/User";
import bcrypt from "bcrypt";

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
    const user = await User.findOne({username});
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
        client_id:"590e385d8f2b6909bc98",
        allow_signup:false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    return res.redirect(finalURL);
}

export const finishGithubLogin =(req, res) => {
}

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => {
    req.session.loggedIn = false;
    return res.redirect("/");
}
export const see = (req, res) => {
    return res.send(`See User #${req.params.id}`);
}