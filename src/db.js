import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅Connected to DB");
const handleError = (error) => console.log("❌DB Error: ", error);

//listen Event
//.on은 반복적으로 사용(다양한 event들이 실행될 때마다 error를 확인)
db.on("error", handleError);
//.once는 한번만 실행
db.once("open", handleOpen);