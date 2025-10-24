import dynamoose from "dynamoose";

const UserSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
  },
  userName: String,
  fullName: String,
  score: {
    type: Number,
    default: 0,
  },
});

export default dynamoose.model("User", UserSchema);
