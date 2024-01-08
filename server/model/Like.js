const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tweetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true
    }
});

module.exports = mongoose.model('Like', likeSchema);
