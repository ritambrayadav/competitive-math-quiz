import Question from "../models/Question.js";
import { generateQuestion } from "../utils/generateQuestion.js";

// controllers/questionController.js
let currentQuestion = null;

export async function createNewQuestion(io) {
  const newQuestion = generateQuestion();
  await Question.create(newQuestion);

  currentQuestion = newQuestion; // save for reconnects
  io.emit("newQuestion", newQuestion);

  console.log("✅ Emitted new question:", newQuestion.question);
  return newQuestion;
}

// Helper to get the latest question
export function getCurrentQuestion() {
  return currentQuestion;
}



export const submitAnswer = async (req, res) => {
  const { questionId, userId, userName, answer } = req.body;

  if (!questionId || !userId || answer === undefined) {
    return res.status(400).json({ error: "questionId, userId, and answer are required" });
  }

  try {
    const question = await Question.get({ questionId });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.winner) {
      return res.status(200).json({ message: "Answer already submitted by another user" });
    }

    if (Number(answer) === Number(question.correctAnswer)) {
      question.winner = {
        userId,
        userName,
        answer,
        submittedAt: new Date().toISOString(),
      };

      await question.save();

      if (User) {
        const userRecord = await User.get({ userId });
        if (userRecord) {
          userRecord.score = (userRecord.score || 0) + 1;
          await userRecord.save();
        }
      }
      const io = req.app.get("io");
      if (io) io.emit("questionWinner", question.winner);

      return res.status(200).json({ message: "Correct! You are the winner.", winner: question.winner });
    } else {
      return res.status(200).json({ message: "Incorrect answer." });
    }
  } catch (err) {
    console.error("Error submitting answer:", err);
    res.status(500).json({ error: err.message });
  }
};