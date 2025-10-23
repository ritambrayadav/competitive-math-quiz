import questionSocket from "./questionSocket.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    questionSocket(io, socket);
  });
}
