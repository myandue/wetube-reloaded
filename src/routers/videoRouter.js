import express from "express";
import {upload, see, edit, remove} from "../controllers/videoController";

const videoRouter = express.Router();


//변수를 받아들이는 get은 밑으로 빼야함
//만약, "/:id"가 첫번째 줄에 있었다면, url을 "/video/upload"로 쳤을 때, upload라는 텍스트를 ":/id"의 변수로 인지해버림
//expres가 script를 위에서부터 순서대로 체크하기 때문 
videoRouter.get("/upload", upload);
//"(\\d+)" 숫자만 택함
//":id"는 변수명을 의미 => id = 123123 이런식의 것이 필요하기 때문 
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", remove);


export default videoRouter;