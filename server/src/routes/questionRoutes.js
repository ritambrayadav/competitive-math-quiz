import express from "express";
import { getCurrentQuestion } from "../controllers/questionController.js";

const routerQuestion = express.Router();
routerQuestion.get("/", getCurrentQuestion);

export default routerQuestion;
