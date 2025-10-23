import express from "express";
import { getCurrentQuestion, submitQuestion} from "../controllers/questionController.js";

const routerQuestion = express.Router();
routerQuestion.get("/", getCurrentQuestion);
routerQuestion.post("/submit", submitQuestion);

export default routerQuestion;
