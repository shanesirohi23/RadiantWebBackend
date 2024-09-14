const Post = require("../Models/postModel");
const User = require("../Models/userModel");

const createPost = async (req, res) => {
  try {
    let { posttext } = req.body;
    let postImage = req.file;
    let author = req.user;

    if (!posttext) {
      return res.status(400).json({ error: "Content for post is required" });
    }

    if (posttext.length > 500) {
      return res.status(400).json({ error: "Maximum length of characters is 500" });
    }

    let newPostData = {
      author: author._id,
      posttext: posttext,
    };

    if (postImage) {
      newPostData.postImage = postImage.path;
    }

    let newPost = await Post.create(newPostData);
    return res.status(200).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error in creating post" });
  }
};

const getSinglePost = async (req, res) => {
  let { id } = req.params;
  try {
    let post = await Post.findById(id)
      .populate('author')
      .populate({
        path: 'replies',
        populate: {
          path: 'replyinguser',
          model: 'User'
        }
      });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    let allPosts = await Post.find({}).sort({ createdAt: -1 }).populate('author');
    if (allPosts.length == 0) {
      return res.status(400).json({ error: "No posts yet" });
    }
    return res.status(200).json(allPosts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const editPost = async (req, res) => {
  let { id } = req.params;
  let { posttext } = req.body;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot update someone else's post" });
    }
    post.posttext = posttext || post.posttext;
    await post.save();
    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  let { id } = req.params;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot delete someone else's post" });
    }
    await post.remove();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const likeUnlikePost = async (req, res) => {
  let { id } = req.params;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    let user = req.user;
    if (!user) {
      return res.status(400).json({ error: "Login to like/unlike posts" });
    }
    if (post.likes.includes(user._id)) {
      post.likes.pull(user._id);
      await post.save();
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(user._id);
      await post.save();
      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error in liking/unliking post" });
  }
};

module.exports = {
  createPost,
  getSinglePost,
  getAllPosts,
  editPost,
  deletePost,
  likeUnlikePost
};
