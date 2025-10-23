import Question from "../models/Question.js";
import { generateQuestion } from "../utils/generateQuestion.js";

export async function createNewQuestion(io) {
  const newQuestion = generateQuestion();
  await Question.create(newQuestion);

  io.emit("newQuestion", newQuestion);
  console.log("New Question:", newQuestion.question);
  return newQuestion;
}

export async function getCurrentQuestion(req, res) {
  try {
    const questions = await Question.scan().limit(1).exec();
    if (questions.length === 0) {
      return res.status(404).json({ message: "No question found" });
    }
    res.json(questions[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching question" });
  }
}
