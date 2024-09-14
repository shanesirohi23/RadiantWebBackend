const express = require('express');
const isAuthenticated = require('../Middlewares/isAuthenticated');
const { postReply, deleteReply } = require('../Controllers/replyControllers');
const replyRouter = new express.Router();

// Post a reply
replyRouter.post('/reply/:id', isAuthenticated, postReply);

// Delete a reply
replyRouter.delete('/post/:id/reply/:replyId', isAuthenticated, deleteReply);

module.exports = replyRouter;
