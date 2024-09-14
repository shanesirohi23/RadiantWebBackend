const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");
const genjwttoken = require("../utils/genjwttoken");

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

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const followUnfollowUser = async (req, res) => {
  let { id } = req.params;
  try {
    let user = req.user;
    let targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.following.includes(id)) {
      user.following.pull(id);
      targetUser.followers.pull(user._id);
      await user.save();
      await targetUser.save();
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      user.following.push(id);
      targetUser.followers.push(user._id);
      await user.save();
      await targetUser.save();
      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error in follow/unfollow:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  let { id } = req.params;
  let { name, email } = req.body;
  try {
    if (req.user._id.toString() !== id) {
      return res.status(403).json({ error: "You cannot update someone else's profile" });
    }
    let updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  let { query } = req.params;
  try {
    let user = await User.findOne({ username: query }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUser,
  getAllUsers
};
