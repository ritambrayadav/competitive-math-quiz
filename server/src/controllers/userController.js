import User from "../models/User.js";

export const createUser = async (req, res) => {
  const { userId, userName, fullName } = req.body;

  if (!userId || !userName || !fullName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await User.get(userId);
    if (existing) return res.status(200).json(existing);
    const user = await User.create({ userId, userName, fullName, score: 0 });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.get(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
