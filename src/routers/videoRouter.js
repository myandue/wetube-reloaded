import express from "express";
import {watch, getEdit, postEdit, getDelete, getUpload, postUpload} from "../controllers/videoController";
import { protectorMiddleware, uploadVideo } from "../middlewares";

const videoRouter = express.Router();


//변수를 받아들이는 get은 밑으로 빼야함
//만약, "/:id"가 첫번째 줄에 있었다면, url을 "/video/upload"로 쳤을 때, upload라는 텍스트를 ":/id"의 변수로 인지해버림
//expres가 script를 위에서부터 순서대로 체크하기 때문
//regular expression
///"(\\d+)" 숫자만 택함
///"([0-9a-f]{24})" 0~9, a~f를 이용한 24개의 문자를 매칭 (hexadecimal)
//":id"는 변수명을 의미 => id = 123123 이런식의 것이 필요하기 때문 
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(uploadVideo.fields([{name:"video",maxCount:"1"},{name:"thumb",maxCount:"1"}]),postUpload);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware,getDelete);


export default videoRouter;