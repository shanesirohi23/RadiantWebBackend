const express = require("express");
const postRouter = new express.Router();
const isAuthenticated = require("../Middlewares/isAuthenticated");
const {
  createPost,
  getSinglePost,
  editPost,
  deletePost,
  getAllPost,
  getUserPost,
  likeUnlikePost,
} = require("../Controllers/postControllers");
const multer = require("multer");
const { storage } = require("../utils/configCloudinary");
const upload = multer({ storage: storage });

// Get single post
postRouter.get("/post/:id", getSinglePost);

// Get all posts (timeline)
postRouter.get("/timeline", getAllPost);

// Get posts of a specific user
postRouter.get("/post/user/:username", getUserPost);

// Create a post
postRouter.post("/post/create", isAuthenticated, upload.single("postImage"), createPost);

// Edit a post
postRouter.put("/post/:id", isAuthenticated, editPost);

// Delete a post
postRouter.delete("/post/:id", isAuthenticated, deletePost);

// Like/Unlike a post
postRouter.post("/like/:id", isAuthenticated, likeUnlikePost);

module.exports = postRouter;
