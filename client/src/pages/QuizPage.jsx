import QuestionPanel from "../components/QuestionPanel.jsx";

export default function QuizPage() {
  return (
    <div className="quiz-container">
      <main className="main-content">
        <div className="question-area">
          <QuestionPanel />
        </div>
      </main>
    </div>
  );
}
