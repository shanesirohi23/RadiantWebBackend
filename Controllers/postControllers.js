const Post = require("../Models/postModel");
const User = require("../Models/userModel");

const createPost = async (req, res) => {
  try {
    let { posttext } = req.body;
    let postImage = req.file;
    console.log(req.file)
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

    console.log(newPost);

    return res.status(200).json({ message: "Post created successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error in creating post" });
  }
};


const getSinglePost = async (req, res) => {
  let { id } = req.params;
  try {
    let post = await Post.findById(id) .populate('author').populate({
      path: 'replies',
      populate: {
        path: 'replyinguser',
        model: 'User'
      }
    });
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getAllPost = async (req, res) => {
  try {
    let AllPosts = await Post.find({}).sort({createdAt: -1}).populate('author');
    if (AllPosts.length == 0) {
      return res.status(400).json({ error: "no Posts yet" });
    }
    return res.status(200).json(AllPosts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};



const editPost = async (req, res) => {
  let { id } = req.params;

  let { posttext} = req.body;
  try {
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    let postAuthor = post.author;
    let currUser = req.user._id;
    console.log(postAuthor.toString(), currUser.toString());
    if (postAuthor.toString() !== currUser.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot update someone else's post" });
    }
    if (!posttext) {
      return res.status(400).json({ error: "Content for post is required" });
    }
    let updatedpost = await Post.findByIdAndUpdate(
      id,
      {
        posttext: posttext,
      },
      { new: true }
    );

    return res.status(200).json({message:"post updated successfully"});
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
      return res.status(404).json({ error: "post not found" });
    }
    let postAuthor = post.author;
    let currUser = req.user._id;
    if (postAuthor.toString() !== currUser.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot delete someone else's post" });
    }
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getUserPost = async (req, res) => {
  try {
    let { username } = req.params;
    const user = await User.findOne({ username:username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ author: user._id.toString() }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const likeUnlikePost= async(req,res)=>{
  let  {id}=req.params;
try {
  
    let post= await Post.findById(id);
    if(!post){
      return res.status(404).json({error:"Post not found"});
    };
   let currUser=req.user;
  if(!currUser){
    return res.status(404).json({error:"Login to like someone's post"});
  }
  if(post.likes.includes(currUser._id)){
    post.likes.pull(currUser._id);
    post.save();
    return res.status(200).json({message:"post unliked successfully"})
  }
  post.likes.push(currUser._id);
  post.save();
  return res.status(200).json({message:"post liked successfully"})
} catch (error) {
  console.log(error.message);
  return res.status(500).json({ message: "Error in liking/unliking post" });
}
}




module.exports = {
  createPost,
  getSinglePost,
  editPost,
  deletePost,
  getAllPost,
  getUserPost,
  likeUnlikePost,

};
