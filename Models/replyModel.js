const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./userModel');

const replySchema = new Schema({
    replyinguser: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    text: {
        type: String,
        required: true
    },
});

replySchema.set('timestamps', true);
const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
