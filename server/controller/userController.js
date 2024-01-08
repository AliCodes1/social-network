const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk'); // AWS SDK for S3 uploads
const Tweet = require("../model/tweet");
// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.updateProfile = async (req, res) => {
    const { username, description } = req.body;
    const profileDescription=description;
    let profilePicture = null;
    if (req.file) {
        // Upload the file to S3 and get the URL
        const s3Response = await s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${Date.now()}_${req.file.originalname}`,
            Body: req.file.buffer,
            ACL: 'public-read'
        }).promise();

        profilePicture = s3Response.Location;
    }

    try {
        const response= await User.findByIdAndUpdate(req.user._id, {
            username:username,
            profileDescription:profileDescription,
            profilePicture:profilePicture
        },{new:true , upsert:true});

        await updateTweetsForUser(req.user._id, {
            userName: username,
            profilePicture: profilePicture
        });

        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
};

async function updateTweetsForUser(userId, updateData) {
    try {
        await Tweet.updateMany(
            { userID: userId },
            { $set: { userName: updateData.userName, profilePicture: updateData.profilePicture } }
        );
    } catch (error) {
        console.error("Error updating user's tweets:", error);
    }
};

exports.getUserWithFollowData = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('following').populate("followed").select("-password");

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.addFollower = async (req, res) => {
    const { currentUserId, targetUserId } = req.body;

    try {
        // Add target user to current user's following list
        await User.findByIdAndUpdate(currentUserId, { 
            $addToSet: { following: targetUserId }
        });

        // Add current user to target user's followed list
        await User.findByIdAndUpdate(targetUserId, { 
            $addToSet: { followed: currentUserId }
        });

        res.status(200).send({ message: 'Followed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error following user', error });
    }
};

exports.removeFollower = async (req, res) => {
    const { currentUserId, targetUserId } = req.body;

    try {
        // Remove target user from current user's following list
        await User.findByIdAndUpdate(currentUserId, { 
            $pull: { following: targetUserId }
        });

        // Remove current user from target user's followed list
        await User.findByIdAndUpdate(targetUserId, { 
            $pull: { followed: currentUserId }
        });

        res.status(200).send({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error unfollowing user', error });
    }
};
exports.registerUser = async (req, res) => {
    try {
        const newUser = new User(req.body);

        await newUser.save();
        
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error);

    }
};


exports.checkSession = async (req, res) => {
    try {
        const token = req.cookies['token'];
        console.log("test session",token);
        if (!token) {
            return res.status(200).json({ isLoggedIn: false });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(200).json({ isLoggedIn: false });
            }

            try {
                const user = await User.findById(decoded._id).select('-password'); // Exclude sensitive data like password
                if (!user) {
                    return res.status(200).json({ isLoggedIn: false });
                }
                
                return res.status(200).json({ isLoggedIn: true, user });
            } catch (userFetchError) {
                return res.status(500).json({ isLoggedIn: false });
            }
        });
    } catch (error) {
        return res.status(500).json({ isLoggedIn: false });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true, secure: true }); 

        res.status(200).send({ user });
    } catch (error) {
        res.status(500).send(error);
    }
};

// In your server-side route handler (e.g., in Express.js)
exports.logoutUser = async (req, res) => {
    res.clearCookie('token'); // Clear the cookie named 'token'
    res.status(200).send({ message: 'Logged out successfully' });
};
  


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
