import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;
