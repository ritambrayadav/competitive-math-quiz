import Question from "../models/Question.js";
import User from "../models/User.js";
import { generateQuestion } from "../utils/generateQuestion.js";

let currentQuestion = null;
let activeTimer = null;

export async function createNewQuestion(io) {

  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }

  const newQuestion = generateQuestion();
  await Question.create(newQuestion);

  currentQuestion = newQuestion;
  io.emit("newQuestion", newQuestion);
  console.log("Emitted new question:", newQuestion.question);
  activeTimer = setTimeout(async () => {
    try {
      const q = await Question.get({ questionId: newQuestion.questionId });
      if (!q.winner) {
        io.emit("questionTimeout", {
          message: "Time’s up!",
          correctAnswer: q.correctAnswer,
        });
        console.log(`Question timed out: ${q.question}`);
        await createNewQuestion(io);
      }
    } catch (err) {
      console.error("Timeout error:", err);
    }
  }, 30000);

  return newQuestion;
}

export function getCurrentQuestion() {
  return currentQuestion;
}



export const submitAnswer = async (req, res) => {
  const { questionId, userId, userName, fullName, answer } = req.body;

  if (!questionId || !userId || answer === undefined) {
    return res.status(400).json({ error: "questionId, userId, and answer are required" });
  }

  try {
    const question = await Question.get({ questionId });
    const io = req.app.get("io");

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    if (question.winner) {
      const isCorrect = Number(answer) === Number(question.correctAnswer);
      return res.status(200).json({
        message: "This question already has a winner.",
        winner: question.winner,
        yourAnswerCorrect: isCorrect,
      });
    }
    if (Number(answer) === Number(question.correctAnswer)) {
      question.winner = { userId, userName, fullName, answer, submittedAt: new Date().toISOString() };
      await question.save();

       if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
   let user = await User.get(userId).catch(() => null);
      if (!user) {
        user = new User({ userId, userName, fullName, score: 1 });
      } else {
        user.score = (user.score || 0) + 1;
      }
      await user.save();
      if (io) io.emit("questionWinner", question.winner); 

      setTimeout(async () => {
        await createNewQuestion(io);
      }, 3000);

      return res.status(200).json({ message: "Correct! You are the winner.", winner: question.winner, newScore: user.score,
 });
    } else {
      return res.status(200).json({ message: "Incorrect answer." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
