import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user ||{};
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    } else{
        req.flash("error","Not Authorized");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    } else{
        req.flash("error", "Not Authorized");
        return res.redirect("/");
    }
}

//uploads 폴더에 파일을 저장해주는 미들웨어 multer, 파일명을 랜덤으로 지정해주는 기능 있슴(중복이 안됨)
export const uploadAvatar = multer({dest:"uploads/avatars/", limits:{
    fileSize:3000000,
}
});
export const uploadVideo = multer({dest:"uploads/videos/", limits:{
    fileSize:10000000,
}})