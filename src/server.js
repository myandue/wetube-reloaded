import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import session from "express-session";
import MongoStore from "connect-mongo";

//"."은 지금의 위치를 의미
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";
import { cookie } from "express/lib/response";

//create appalication
const app=express();
const logger=morgan("dev");

//https://expressjs.com/en/api.html#app.engine
//https://www.npmjs.com/package/pug
//사용할 view engine이 pug라고 설정해줌 
app.set("view engine","pug");
//cwd=current working directory, node는 package.json에서 실행되고 있으므로
//cwd는 ~~/documents/wetube 임
//하지만 우리는 모든 코드를 src에 넣을것이기 때문에 하기와 같은 세팅이 필요함 
app.set("views", process.cwd()+"/src/views");

app.use(logger);

app.use(express.urlencoded({extended: true}));

//session middleware가 사이트로 들어오는 모두를 기억함.
//브라우저에 cookie를 전송.
//유저가 req를 보내면 그 req에 cookie를 덧붙여 보냄.
//라우터 이전에 위치
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        //세션이 수정되지 않으면 쿠키를 주지 않음(false) = 세션이 수정 될 때만 쿠키를 줌
        // = 세션이 수정되는 경우는 유저가 로그인시에!(userController에서 확인)
        saveUninitialized: false,
        //store를 통해 브라우저(유저)의 정보를 서버가 아닌 db에 저장 
        store: MongoStore.create({mongoUrl:process.env.DB_URL}),
    })
);

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
    });
    
app.get("/add-one", (req, res, next) => {
    res.send(`${req.session.id}`);
});

app.use(flash());
app.use(localsMiddleware);

//uploads 폴더를 브라우저에 노출
app.use("/uploads",express.static("uploads"));
app.use("/assets",express.static("assets"));

//서버가 url이 무엇("/", "/videos"...)으로 시작하는지에 따라 라우터("rootRouter", "videoRouter"...)를 설정해줌
app.use("/",rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);
app.use("/api",apiRouter);

export default app;