const Follow = require('../model/follow');
const User = require('../model/User');

exports.addFollower = async (req, res) => {
    const followedID = req.body.followedID;
    const followingID = req.body.followingID;

    try {
        // Check if both users exist
        const followedExists = await User.exists({ _id: followedID });
        const followingExists = await User.exists({ _id: followingID });

        if (!followedExists || !followingExists) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check if the follow relationship already exists
        const followExists = await Follow.findOne({ followedID, followingID });
        if (followExists) {
            return res.status(400).send({ message: "Already following this user" });
        }

        // Create a new follow relationship
        const newFollow = new Follow({ followedID, followingID });
        await newFollow.save();
        res.status(201).send({ message: "Followed successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};


exports.removeFollower = async (req, res) => {
    const followedID = req.body.followedID;
    const followingID = req.body.followingID;

    try {
        const follow = await Follow.findOneAndDelete({ followedID, followingID });
        if (!follow) {
            return res.status(404).send({ message: "Follow relationship not found" });
        }
        res.status(200).send({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
};
