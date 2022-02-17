import express from "express";
import {edit, remove, logout, see} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout",logout);
userRouter.get("/edit",edit);
userRouter.get("/remove",remove);
userRouter.get("/:id(\\d+)",see); //":"는 파라미터를 의미 => url안에 변수를 넣도록 해줌 

export default userRouter;