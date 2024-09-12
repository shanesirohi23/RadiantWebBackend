const express = require ('express');
const { registeruser, loginUser, logoutUser, followUnfollowUser, updateUser, getUser, getAllUser } = require('../Controllers/userControllers');
const isAuthenticated = require('../Middlewares/isAuthenticated');
const userRouter= new express.Router();

const multer=require ('multer');
const {storage}= require ('../utils/configCloudinary')
const upload = multer({ storage: storage });

//getUser
userRouter.get('/api/v1/user/:query', getUser);
//getAllUser
userRouter.get('/api/v1/users', getAllUser);
//signup
userRouter.post('/api/v1/signup', registeruser);
//login
userRouter.post('/api/v1/login', loginUser);
//logout
userRouter.post('/api/v1/logout', logoutUser);
//folow/unfollow
userRouter.post('/api/v1/follow/:id' , isAuthenticated, followUnfollowUser);
//updateUser
userRouter.put('/api/v1/user/:id', isAuthenticated, upload.single("pfp"), updateUser );


module.exports=userRouter