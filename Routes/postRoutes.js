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

postRouter.get("/api/v1/post/:id", getSinglePost);
postRouter.get("/api/v1/timeline", getAllPost);
postRouter.get("/api/v1/post/user/:username", getUserPost);
postRouter.post( "/api/v1/post/create", isAuthenticated, upload.single("postImage"),createPost);
postRouter.put("/api/v1/post/:id", isAuthenticated, editPost);
postRouter.delete("/api/v1/post/:id", isAuthenticated, deletePost);
postRouter.post("/api/v1/like/:id", isAuthenticated, likeUnlikePost);

module.exports = postRouter;
