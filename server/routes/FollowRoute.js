const express=require("express");
const router=express.Router();
const authenticate=require("../middleware/auth");

const followContoller=require("../controller/followerController");

router.post("/follow",authenticate,followContoller.addFollower);

router.delete("/unfollow",authenticate,followContoller.removeFollower);

module.exports = router;
