const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to ObjectId
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        default: Date.now
    },
    isRetweet: {
        type: Boolean,
        default: false
    },
    originalTweetID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    userName:{
        type:String,
    },
    profilePicture:{
        type:String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Tweet', tweetSchema);