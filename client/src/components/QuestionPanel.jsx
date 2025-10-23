import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../utils/sockets.js";

export default function QuestionPanel({ user }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!question || winner || !answer) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/answer/submit", {
        questionId: question.questionId,
        userId: user.userId,
        userName: user.userName,
        answer: Number(answer),
      });
      setAnswer("");
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Failed to submit answer. Try again.");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />
          <button onClick={handleSubmit} disabled={loading || !answer}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      ) : (
        <p>
          Winner: {winner.userName} answered {winner.answer} first!
        </p>
      )}
    </div>
  );
}
