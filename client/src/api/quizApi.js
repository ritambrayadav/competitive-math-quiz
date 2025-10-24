import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export const createUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/user`, userData);
    return res.data;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

export const getUserScore = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/user/${userId}`);
    return res.data.score;
  } catch (err) {
    console.error("Error fetching user score:", err);
    throw err;
  }
};

export const submitAnswer = async (questionId, userData, answer) => {
  try {
    const res = await axios.post(`${API_BASE}/question/submit`, {
      questionId,
      userId: userData.userId,
      userName: userData.userName,
      fullName: userData.fullName,
      answer: Number(answer),
    });
    return res.data;
  } catch (err) {
    console.error("Error submitting answer:", err);
    throw err;
  }
};
