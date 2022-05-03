import Video from "../models/Video";
import User from "../models/User";

export const home = async(req,res) => {
    try{
        const videos = await Video.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");        return res.render("home",{pageTitle:"Home", videos});
    } catch(error){
        return res.status(400).render("server-error", error);
    }
}
export const watch = async(req, res) => {
    const {id}=req.params;
    //videoSchema의 owner 항목의 ref로 User를 넣어줬기 때문에
    //populate를 이용해 owner를 id로 연결된 User로 채울 수 있음.
    //object (여기서는 owner에 해당하는 user 정보) 전체를 불러와야 할 때 populate 사용]
    const video = await Video.findById(id).populate("owner");
    return res.render("watch",{pageTitle:video.title, video});
}
export const getEdit = async(req, res) => {
    const{
        params:{id},
        session:{
            user:{_id},
        }
    }=req;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner)!==String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("edit",{pageTitle:`Edit: ${video.title}`, video});
};
export const postEdit = async(req, res) => {
    const {
        params:{id},
        body:{title, description, hashtags},
        session:{
            user:{_id},
        }
    }=req;
    const video = await Video.exists({ _id: id});
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner)!==String(_id)){
        return res.status(403).redirect("/");
    }
    await  Video.findByIdAndUpdate(id,{
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload",{pageTitle:"Upload Video"});
};
export const postUpload = async(req, res) => {
    const {
        session:{
            user:{
                _id,
            },
        },
        files:{
            video, thumb,
        },
        body:{
            title, description, hashtags,
        }
    } = req;
    try{
        const newVideo = await Video.create({
            owner:_id,
            fileUrl:video[0].path,
            thumbUrl:thumb[0].path,
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch(error){
        return res.status(400).render("upload",{
            pageTitle:"Upload Video", 
            errorMessage:error._message,
        });
    }
    
};

export const getDelete = async(req, res) => {
    const {
        params:{id},
        session:{
            user:{_id},
        }
    }=req;
    const video=await findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner)!==String(_id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async(req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword,"i"),
            },
        }).populate("owner");
    }
    return res.render("search",{pageTitle: "Search", videos});
}

export const registerView = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
}
