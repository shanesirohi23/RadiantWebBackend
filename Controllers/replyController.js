const Reply = require("../Models/replyModel");
const Post = require("../Models/postModel");

const postReply = async (req, res) => {
  let { id } = req.params;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    let { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Content for reply is required" });
    }
    let reply = new Reply({
      replyinguser: req.user._id,
      text: text,
    });
    await reply.save();
    post.replies.push(reply);
    await post.save();
    return res.status(200).json({ message: "Reply posted successfully" });
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
      return res.status(404).json({ error: "Reply not found" });
    }
    if (reply.replyinguser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this reply" });
    }
    await reply.remove();
    post.replies.pull(replyid);
    await post.save();
    return res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postReply,
  deleteReply
};
