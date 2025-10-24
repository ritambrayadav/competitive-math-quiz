import express from "express";
import { getCurrentQuestion, submitAnswer} from "../controllers/questionController.js";

const routerQuestion = express.Router();
routerQuestion.get("/", getCurrentQuestion);
routerQuestion.post("/submit", submitAnswer);

export default routerQuestion;
