import QuestionPanel from "../components/QuestionPanel.jsx";
// import CurrentWinner from "../components/CurrentWinner.jsx";
// import Leaderboard from "../components/Leaderboard.jsx";

export default function QuizPage() {
  return (
    <div className="quiz-container">
      <header>
        <h1>Competitive Math Quiz</h1>
      </header>

      <main className="main-content">
        <div className="question-area">
          <QuestionPanel />
        </div>

        <aside className="sidebar">
          {/* <CurrentWinner /> */}
          {/* <Leaderboard /> */}
        </aside>
      </main>
    </div>
  );
}
