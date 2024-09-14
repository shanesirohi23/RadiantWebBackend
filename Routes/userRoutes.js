const express = require('express');
const { registerUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUser, getAllUsers } = require('../Controllers/userControllers');
const isAuthenticated = require('../Middlewares/isAuthenticated');
const multer = require('multer');
const { storage } = require('../utils/configCloudinary');
const upload = multer({ storage: storage });

const userRouter = express.Router();

// Get user
userRouter.get('/user/:query', getUser);

// Get all users
userRouter.get('/users', getAllUsers);

// Signup
userRouter.post('/signup', registerUser);

// Login
userRouter.post('/login', loginUser);

// Logout
userRouter.post('/logout', logoutUser);

// Follow/Unfollow
userRouter.post('/follow/:id', isAuthenticated, followUnfollowUser);

// Update user
userRouter.put('/user/:id', isAuthenticated, upload.single('pfp'), updateUser);

module.exports = userRouter;
