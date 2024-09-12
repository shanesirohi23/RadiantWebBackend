const express = require('express');
const { registeruser, loginUser, logoutUser, followUnfollowUser, updateUser, getUser, getAllUser } = require('../Controllers/userControllers');
const isAuthenticated = require('../Middlewares/isAuthenticated');
const multer = require('multer');
const { storage } = require('../utils/configCloudinary');
const upload = multer({ storage: storage });

const userRouter = new express.Router();

// Get user
userRouter.get('/user/:query', getUser);

// Get all users
userRouter.get('/users', getAllUser);

// Signup
userRouter.post('/signup', registeruser);

// Login
userRouter.post('/login', loginUser);

// Logout
userRouter.post('/logout', logoutUser);

// Follow/Unfollow
userRouter.post('/follow/:id', isAuthenticated, followUnfollowUser);

// Update user
userRouter.put('/user/:id', isAuthenticated, upload.single('pfp'), updateUser);

module.exports = userRouter;
