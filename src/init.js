import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT=4000;

//외부에 개방 
const handleListening = () => console.log(`✅Server listening on http://localhost:${PORT} 👾`);

//listen
app.listen(PORT, handleListening);