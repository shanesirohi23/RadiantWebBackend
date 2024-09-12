const express = require('express');
const isAuthenticated = require('../Middlewares/isAuthenticated');
const { postReply, deleteReply } = require('../Controllers/replyController');
const replyRouter = new express.Router();

// Post a reply
replyRouter.post('/reply/:id', isAuthenticated, postReply);

// Delete a reply
replyRouter.delete('/post/:id/reply/:replyid', isAuthenticated, deleteReply);

module.exports = replyRouter;
