import { useState, useEffect } from "react";
import socket from "../utils/sockets.js";

export default function QuestionPanel({ user }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("newQuestion", (q) => {
      setQuestion(q);
      setWinner(null);
      setAnswer("");
    });

    socket.on("questionWinner", (w) => {
      setWinner(w);
    });

    return () => {
      socket.off("newQuestion");
      socket.off("questionWinner");
    };
  }, []);

  const handleSubmit = () => {
    if (!question || winner) return;

    socket.emit("submitAnswer", {
      questionId: question.questionId,
      userId: user.userId,
      userName: user.userName,
      answer: Number(answer),
    });

    setAnswer("");
  };

  return (
    <div className="question-panel">
      {question ? <h2>{question.text}</h2> : <p>Loading question...</p>}

      {!winner ? (
        <div className="answer-section">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <p>
          Winner: {winner.userName} answered {winner.answer} first!
        </p>
      )}
    </div>
  );
}
