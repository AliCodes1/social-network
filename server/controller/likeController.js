const Like = require('../model/Like');
const User = require('../model/User'); // Assuming you have a User model
const Tweet = require('../model/tweet'); // Assuming you have a Tweet model

exports.addLike = async (req, res) => {
    try {
        const { userID, tweetID } = req.body;

        // Check if the tweet exists
        const tweetExists = await Tweet.exists({ _id: tweetID });
        if (!tweetExists) {
            return res.status(404).send({ message: 'Tweet not found' });
        }

        // Check if the like already exists
        const likeExists = await Like.findOne({ userID, tweetID });
        if (likeExists) {
            return res.status(400).send({ message: 'Like already exists' });
        }

        const newLike = new Like({ userID, tweetID });
        await newLike.save();

        res.status(201).send(newLike);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.removeLike = async (req, res) => {
    try {
        const { userID, tweetID } = req.body;

        const like = await Like.findOneAndDelete({ userID, tweetID });
        if (!like) {
            return res.status(404).send({ message: 'Like not found' });
        }

        res.status(200).send({ message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getLikesByTweet = async (req, res) => {
    try {
        const { tweetID } = req.params;

        const likes = await Like.find({ tweetID }).populate('userID', 'username');
        res.status(200).send(likes);
    } catch (error) {
        res.status(500).send(error);
    }
};
