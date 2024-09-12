const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');
const Reply = require('./replyModel');

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    posttext: {
        type: String,
        maxlength: 500,
        required: true
    },
    postImage: {
        type: String
    },
    likes:[{
        type: Schema.Types.ObjectId,
        ref: User
    }] ,
    replies: [{
        type: Schema.Types.ObjectId,
        ref: Reply
    }],
});

postSchema.set('timestamps', true);

postSchema.post('findOneAndDelete', async (post)=>{
    if(post){
        await Reply.deleteMany({_id: {$in: post.comments}})
    }
})


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
