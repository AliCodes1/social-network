const express=require("express");
const router = express.Router();
const authenticate=require("../middleware/auth");

const tweet=require("../controller/tweetController");

router.post("/tweet",authenticate,tweet.createTweet);

router.post("/addLike",authenticate,tweet.addLike);

router.post("/removeLike",authenticate,tweet.removeLike);

router.get("/getTweet",tweet.getTweets);

router.get("/getAllTweets",tweet.getAllTweets);


router.put("/updateTweet/:tweetId",authenticate,tweet.updateTweet);

router.delete("/deleteTweet/:tweetId",authenticate,tweet.deleteTweet);

module.exports=router;