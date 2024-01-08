const Tweet = require('../model/tweet');
const User = require('../model/User'); // Assuming you have a User model
const websocket = require('../webSocket');
const WebSocket = require('ws');

exports.addLike = async (req, res) => {
    const { tweetID, userID } = req.body;
    try {
        await Tweet.findByIdAndUpdate(tweetID, { $addToSet: { likes: userID } });
        res.status(200).json({ message: "Like added" });
    } catch (error) {
        res.status(500).json({ message: "Error adding like" });
    }
};

exports.removeLike = async (req, res) => {
    const { tweetID, userID } = req.body;
    try {
        await Tweet.findByIdAndUpdate(tweetID, { $pull: { likes: userID } });
        res.status(200).json({ message: "Like removed" });
    } catch (error) {
        res.status(500).json({ message: "Error removing like" });
    }
};

exports.createTweet = async (req, res) => {
    try {
        const { userID, userName, profilePicture, content, isRetweet, originalTweetID } = req.body;
        // Optionally, verify if the user exists
        const userExists = await User.exists({ _id: userID });

        if (!userExists) {
            return res.status(404).send({ message: 'User not found' });
        }

        const newTweet = new Tweet({ userID, userName, profilePicture, content, isRetweet, originalTweetID });
        await newTweet.save();
        const wss = websocket.getWss();
        // Broadcast new tweet to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(newTweet));
            }
        });

        res.status(201).send(newTweet);
    } catch (error) {
        console.log("error");
        res.status(500).send(error);
    }
};

exports.getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find({}).sort({ postDate: -1 }); 
        res.status(200).json(tweets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tweets", error });
    }
};
exports.getTweets = async (req, res) => {
    try {
        // Assuming the userID is passed in the request body
        const { userID } = req.query;
        // Fetch tweets where the userID matches the provided userID
        const tweets = await Tweet.find({ userID: userID }).populate('userID', 'username');
        
        res.status(200).send(tweets);
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.updateTweet = async (req, res) => {
    const { tweetId } = req.params;
    const updateData = req.body;

    try {
        const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, updateData, { new: true });
        if (!updatedTweet) {
            return res.status(404).send({ message: 'Tweet not found' });
        }

        res.status(200).send(updatedTweet);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteTweet = async (req, res) => {
    const { tweetId } = req.params;

    try {
        const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
        if (!deletedTweet) {
            return res.status(404).send({ message: 'Tweet not found' });
        }

        res.status(200).send({ message: 'Tweet deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};
