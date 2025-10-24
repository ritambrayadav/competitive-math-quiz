import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import questionRoutes from "./routes/questionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import socketHandler from "./sockets/index.js";
import { createNewQuestion } from "./controllers/questionController.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/question", questionRoutes);
app.use("/api/user", userRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);
app.set("io", io);

(async () => {
  await createNewQuestion(io);
})();

app.get("/", (req, res) => {
  res.send("Competitive Math Quiz Server running with Dynamoose & Modular Sockets");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
