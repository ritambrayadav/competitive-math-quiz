import { createNewQuestion } from "../controllers/questionController.js";

export default function questionSocket(io, socket) {
  console.log(`User connected: ${socket.id}`);

  socket.emit("connected", { message: "Welcome to the quiz!" });

  socket.on("submitAnswer", async (data) => {
    console.log(`Answer from ${socket.id}:`, data);
  });

  socket.on("newQuestion", async () => {
    const question = await createNewQuestion(io);
    io.emit("newQuestion", question);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
}
