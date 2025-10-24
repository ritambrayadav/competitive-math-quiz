import { useState, useEffect } from "react";
import socket from "../utils/sockets.js";
import UserModal from "./UserModal.jsx";
import { createUser, getUserScore, submitAnswer } from "../api/quizApi.js";

export default function QuestionPanel() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPurpose, setModalPurpose] = useState(null);
  const [score, setScore] = useState(0);
  const [timeoutMessage, setTimeoutMessage] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("quizUser")) || null;
  const [user, setUser] = useState(storedUser);

  useEffect(() => {
    if (user) {
      getUserScore(user.userId)
        .then((score) => setScore(score))
        .catch(() => {});
    }

    socket.on("newQuestion", (q) => {
      setQuestion(q);
      setWinner(null);
      setAnswer("");
      setTimeoutMessage("");
    });

    socket.on("questionWinner", (w) => {
      setWinner(w);
      setTimeoutMessage("");
    });

    socket.on("questionTimeout", (data) => {
      setWinner(null);
      setTimeoutMessage(
        `${data.message} The correct answer was ${data.correctAnswer}.`
      );
    });

    return () => {
      socket.off("newQuestion");
      socket.off("questionWinner");
      socket.off("questionTimeout");
    };
  }, [user]);

  const handleUserSubmit = async ({ userName, fullName }) => {
    const userData = { userId: userName, userName, fullName };
    setModalOpen(false);

    try {
      if (modalPurpose === "submitAnswer") {
        const res = await submitAnswer(question.questionId, userData, answer);
        if (res.newScore !== undefined) setScore(res.newScore);
        if (res.winner) setWinner(res.winner);
      } else if (modalPurpose === "addUser") {
        await createUser(userData);
      }

      setUser(userData);
      localStorage.setItem("quizUser", JSON.stringify(userData));
    } catch (err) {
      alert("Operation failed");
    } finally {
      setModalPurpose(null);
    }
  };

  const handleSubmitClick = () => {
    if (!user) {
      setModalPurpose("submitAnswer");
      setModalOpen(true);
    } else submitAnswerHandler();
  };

  const submitAnswerHandler = async () => {
    if (!question || winner || !answer) return;
    setLoading(true);
    try {
      const res = await submitAnswer(question.questionId, user, answer);
      if (res.newScore !== undefined) setScore(res.newScore);
      if (res.winner) setWinner(res.winner);
      setAnswer("");
    } catch (err) {
      alert("Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-panel">
      <h1 className="quiz-title">Competitive Math Quiz</h1>

      <div className="user-section">
        {user ? (
          <p className="current-user">
            Logged in as: <strong>{user.fullName}</strong> ({user.userName}) —{" "}
            <span className="user-score">Score: {score}</span>
          </p>
        ) : (
          <button
            className="add-user-btn"
            onClick={() => {
              setModalPurpose("addUser");
              setModalOpen(true);
            }}
          >
            Add User
          </button>
        )}
      </div>

      {question ? (
        <h2 className="question-text">{question.question}</h2>
      ) : (
        <p className="loading-text">Loading question...</p>
      )}

      {timeoutMessage && (
        <p className="timeout-message">{timeoutMessage}</p>
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
          Winner for this question is {winner.fullName}!
        </p>
      )}

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUserSubmit}
        initialUser={user}
        purpose={modalPurpose}
      />
    </div>
  );
}
