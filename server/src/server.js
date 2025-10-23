import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import questionRoutes from "./routes/questionRoutes.js";
import socketHandler from "./sockets/index.js";
import { createNewQuestion } from "./controllers/questionController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/question", questionRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketHandler(io);

(async () => {
  await createNewQuestion(io);
  // setInterval(() => createNewQuestion(io), 30000);
})();

app.get("/", (req, res) => {
  res.send("Competitive Math Quiz Server running with Dynamoose & Modular Sockets");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
