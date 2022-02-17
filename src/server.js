import express from "express";
import morgan from "morgan";

//"."은 지금의 위치를 의미
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT=4000;


//create appalication
const app=express();
const logger=morgan("dev");
app.use(logger);

//서버가 url이 무엇("/", "/videos"...)으로 시작하는지에 따라 라우터("globalRouter", "videoRouter"...)를 설정해줌
app.use("/",globalRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

//handle request
const handleHome=(req, res)=>{
    return res.end(); //request 종료
};

//외부에 개방 
const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

//listen
app.listen(PORT, handleListening);