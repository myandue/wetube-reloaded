import express from "express";

//".."은 현재 폴더(routers 폴더)에서 벗어나는 것을 뜻함
import {trending, search} from "../controllers/videoController";
import {join, login} from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/",trending);
globalRouter.get("/join",join);
globalRouter.get("/login",login);
globalRouter.get("/search", search);


//외부에서 이 파일('globalRouter.js')을 import할 경우에 import하고 싶은 것을 default 설정 해줌
//외부에서 어떤 이름으로 import를 하건, 이 파일을 import한다면 'const globalRouter = express.Router()' 가 불러지는것임 
export default globalRouter;