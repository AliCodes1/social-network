const reply=require("../model/Replies");

exports.createReply = async (req,res)=>{
    try{
        const {tweetID, userID, content, replyDate}=req.body;
        const newReply= new reply ({tweetID,userID,content,replyDate});
        await newReply.save();

        res.status(201).send(newReply);
    }catch (error){
        res.status(500).send(error);
    }
}

exports.getReply=async (req,res)=>{
    try{
        const {tweetID}=req.query;
        const replies = await reply.find({tweetID:tweetID})

        res.status(200).send(replies);
    }catch(error){
        res.status(500).send(error);
    }
}

exports.updateReply=async (req,res)=>{
    const {replyId}=req.params;
    const updateData=req.body;

    try{
        const updatedReply= await reply.findByIdAndUpdate(replyId,updateData,{new:true});
        res.status(200).send(updatedReply);
    }catch(error){
        res.status(500).send(error);
    }
}

exports.deleteReply= async (req,res)=>{
    const {replyId}=req.params;
    try{
        const deletedReply = await reply.findByIdAndDelete(replyId);
        if (!deletedReply) {
            return res.status(404).send({ message: 'reply not found' });
        }

        res.status(200).send({ message: 'reply deleted successfully' });

    } catch(error){
        res.status(500).send(error);
    }
}