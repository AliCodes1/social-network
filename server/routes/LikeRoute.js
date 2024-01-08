const express = require('express');
const likeController = require('../controller/likeController');
const router = express.Router();
const authenticate=require("../middleware/auth");

// Route to handle adding a like to a tweet
router.post('/add', authenticate,likeController.addLike);

// Route to handle removing a like from a tweet
router.delete('/remove', authenticate,likeController.removeLike);

// Route to get all likes for a specific tweet
router.get('/tweet/:tweetID', likeController.getLikesByTweet);

module.exports = router;
