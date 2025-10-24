import { getCurrentQuestion } from "../controllers/questionController.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Send latest question immediately
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      socket.emit("newQuestion", currentQuestion);
      console.log("📤 Sent current question to:", socket.id);
    }

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}
