const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    followedID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Follow', followSchema);
