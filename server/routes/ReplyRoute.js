const replyController=require("../controller/replyController");
const authenticate=require("../middleware/auth");

const express=require("express");
const router=express.Router();

router.post("/reply",authenticate,replyController.createReply);
router.get("/getReply",replyController.getReply);

router.put("/updateReply/:replyId",authenticate,replyController.updateReply);
router.delete("/deleteReply/:replyId",authenticate,replyController.deleteReply);

module.exports=router;