const genjwttoken = require("../utils/genjwttoken");

const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const { isValidObjectId } = require("mongoose");

//getuser
const getUser = async (req, res) => {
  try {
    let { query } = req.params;
    if (isValidObjectId(query)) {
      let user = await User.findById(query)
        .select("-password")
        .select(".updatedAt");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } else {
        return res.status(200).json(user);
      }
    }
    if (typeof query === "string") {
      let user = await User.findOne({ username: query })
        .select("-password")
        .select(".updatedAt");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      } else {
        return res.status(200).json(user);
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
//Signup user
const registeruser = async (req, res) => {
  let { name, username, email, password } = req.body;

  try {
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Minimum length of password is 6" });
    }

    // Check if a user with the given email or username already exists
    let user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      return res
        .status(400)
        .json({
          error: "Sorry, a user with this email or username already exists",
        });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    let newUser = await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });
    newUser = await User.findById(newUser._id).select("-password");

    if (newUser) {
      let usercookie = genjwttoken(newUser._id, res);
      console.log(usercookie);
      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.error("Error in signup:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//login user
const loginUser = async (req, res) => {
  let { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user || !password) {
      return res.status(400).json({ error: "Incorrect username or password" });
    }
    let isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({ error: "Incorrect username or password" });
    }
    genjwttoken(user._id, res);
    let loggedinUser = await User.findById(user._id).select("-password");
    return res.status(200).json(loggedinUser);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Error in login" });
  }
};

//logoutuser
const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

//follow/unfollow user
const followUnfollowUser = async (req, res) => {
  try {
    let { id } = req.params;
    let userTomodify = await User.findById(id);
    let currUser = await User.findById(req.user._id);
    if (userTomodify._id.toString() === currUser._id.toString()) {
      return res
        .status(400)
        .json({ error: "you cant follow or unfollow yourself" });
    }
    if (!currUser) {
      return res.status(400).json({ error: "Login to follow or unfollow" });
    }
    if (userTomodify.followers.includes(currUser._id)) {
      await userTomodify.followers.pull(currUser._id);
      await currUser.following.pull(userTomodify._id);
      await userTomodify.save();
      await currUser.save();
      return res
        .status(200)
        .json({ message: `You just unfollowed ${userTomodify.username}` });
    }
    await userTomodify.followers.push(currUser._id);
    await currUser.following.push(userTomodify._id);
    await userTomodify.save();
    await currUser.save();
    return res
      .status(200)
      .json({ message: `You just followed ${userTomodify.username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in follow unfollow user: ", error.message);
  }
};

//updateUser
const updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, username, email, password, bio } = req.body;
    let pfp
    if(req.file){
      pfp = req.file.path;
    }
 
    console.log(pfp);
    let currUser = req.user;
    let user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (id.toString() !== currUser._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update other users profiles" });
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.pfp = pfp || null;
    user.bio = bio || user.bio;
    await user.save();
    user.password = null;
    res.status(200).json({ message: "profile updated successfully" });
  } catch (error) {
    console.log("Error in update user: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    let AllUser = await User.find({}).select('-password');
    if (AllUser.length == 0) {
      return res.status(400).json({ error: "no users yet" });
    }
    return res.status(200).json(AllUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registeruser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUser,
  getAllUser
};
