import Question from "../models/Question.js";
import { generateQuestion } from "../utils/generateQuestion.js";

let currentQuestion = null;

export async function createNewQuestion(io) {
  const newQuestion = generateQuestion();
  await Question.create(newQuestion);

  currentQuestion = newQuestion; 
  io.emit("newQuestion", newQuestion);

  console.log("Emitted new question:", newQuestion.question);
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
    const io = req.app.get("io"); // make sure io is attached in server.js

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // If question already has a winner
    if (question.winner) {
      const isCorrect = Number(answer) === Number(question.correctAnswer);
      return res.status(200).json({
        message: "This question already has a winner.",
        winner: question.winner,
        yourAnswerCorrect: isCorrect,
      });
    }

    // Correct answer -> assign winner
    if (Number(answer) === Number(question.correctAnswer)) {
      question.winner = { userId, userName, fullName, answer, submittedAt: new Date().toISOString() };
      await question.save();

      if (io) io.emit("questionWinner", question.winner); // emit full winner object

      // Delay for next question
      setTimeout(async () => {
        await createNewQuestion(io);
      }, 3000);

      return res.status(200).json({ message: "Correct! You are the winner.", winner: question.winner });
    } else {
      return res.status(200).json({ message: "Incorrect answer." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
