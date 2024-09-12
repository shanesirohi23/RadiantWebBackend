const express = require ('express');
const isAuthenticated = require('../Middlewares/isAuthenticated');
const { postReply,deleteReply } = require('../Controllers/replyController');
const replyRouter= new express.Router();


// replyRouter.get('/api/v1/post/:postid/replies', getPostReply)
replyRouter.post('/api/v1/reply/:id', isAuthenticated, postReply)
replyRouter.delete('/api/v1/post/:id/reply/:replyid', isAuthenticated, deleteReply)
module.exports=replyRouter