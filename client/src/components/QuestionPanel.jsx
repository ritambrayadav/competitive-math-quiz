import { useState, useEffect } from "react";
import axios from "axios";
import socket from "../utils/sockets.js";
import UserModal from "./UserModal.jsx";

export default function QuestionPanel() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("quizUser")) || null;
  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    socket.on("newQuestion", (q) => {
      setQuestion(q);
      setWinner(null);
      setAnswer("");
    });

    socket.on("questionWinner", (w) => setWinner(w));

    return () => {
      socket.off("newQuestion");
      socket.off("questionWinner");
    };
  }, []);

  const handleSubmitClick = () => {
    if (!user) setModalOpen(true);
    else submitAnswer(user);
  };

  const handleUserSubmit = async ({ userName, fullName }) => {
    const userData = { userId: userName, userName, fullName };
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
    setModalOpen(false);
    await submitAnswer(userData);
  };

  const submitAnswer = async (userData) => {
    if (!question || winner || !answer) return;
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/question/submit", {
        questionId: question.questionId,
        userId: userData.userId,
        userName: userData.userName,
        fullName: userData.fullName,
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
      <h1 className="quiz-title">Competitive Math Quiz</h1>

      {question ? (
        <h2 className="question-text">{question.question}</h2>
      ) : (
        <p className="loading-text">Loading question...</p>
      )}

      {!winner ? (
        <div className="answer-section">
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            className="answer-input"
          />
          <button
            onClick={handleSubmitClick}
            disabled={!answer || loading}
            className={`submit-button ${!answer || loading ? "disabled" : ""}`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      ) : (
        <p className="winner-text">
          {winner.fullName} ({winner.userName}) answered {winner.answer} first!
        </p>
      )}

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUserSubmit}
        initialUser={user}
      />
    </div>
  );
}
