const User = require("../Models/userModel");
const Reply = require("../Models/replyModel");
const Post = require("../Models/postModel");
const { Error } = require("mongoose");

const postReply = async (req, res) => { 
  let { id } = req.params;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    let currUser = req.user;
    if (!currUser) {
      return res.status(400).json({ error: "Login to post a reply" });
    }
    let { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Content for reply is required" });
    }
    let reply = new Reply({
      replyinguser: currUser._id,
      text: text,
    });

    await reply.save();
    post.replies.push(reply);
    await post.save();
    return res.status(200).json({message:"reply posted successfully"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deleteReply = async (req, res) => {
    let { id, replyid } = req.params;
    try {
      let post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      let reply = await Reply.findById(replyid);
      if (!reply) {
        return res.status(404).json({ ErrorEvent: "Reply not found" });
      }
      let currUser = req.user;
      if (!currUser) {
        return res.status(400).json({ error: "Login to delete a reply" });
      }
      if (reply.replyinguser.toString() !== currUser._id.toString()) {
        return res.status(403).json({ error: "You are not authorized to delete this reply" });
      }
      await Reply.deleteOne({ _id: replyid });
      post.replies.pull(replyid);
      await post.save();
  
      return res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  };
  
  
  // const getPostReply  = async (req, res) => {
  //   try {
  //     let { postid } = req.params;
  //     const post= await Post.findById(postid)
  //     if (!post) {
  //       return res.status(404).json({ error: "Post not found" });
  //     }
  //     const  = await Post.find({ author: user._id.toString() }).sort({ createdAt: -1 });
  //     return res.status(200).json(posts);
  //   } catch (error) {
  //     console.log(error.message);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // };

module.exports = { postReply,deleteReply };
