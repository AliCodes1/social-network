const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    tweetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replyDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reply', replySchema);
