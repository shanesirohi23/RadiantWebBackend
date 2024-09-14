const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");
const genjwttoken = require("../utils/genjwttoken");
const { isValidObjectId } = require("mongoose");

const registerUser = async (req, res) => {
  let { name, username, email, password } = req.body;
  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Minimum length of password is 6" });
    }
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User with this email or username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let newUser = await User.create({
      name, username, email, password: hashedPassword
    });
    let userWithoutPassword = await User.findById(newUser._id).select("-password");
    genjwttoken(newUser._id, res);
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error in signup:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  let { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Both username and password are required" });
    }
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    genjwttoken(user._id, res);
    let userWithoutPassword = await User.findById(user._id).select("-password");
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error in login:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser
};
