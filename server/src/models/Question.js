import dynamoose from "../config/dynamodb.js";

const QuestionSchema = new dynamoose.Schema(
  {
    questionId: { type: String, hashKey: true },
    question: String,
    correctAnswer: Number,
    winner: {
      type: Object,
      schema: {
        userId: String,
        userName: String,
        answer: Number,
        submittedAt: String
      },
      default: null
    }
  },
  { timestamps: true }
);

const Question = dynamoose.model("MathQuestions", QuestionSchema);
export default Question;
