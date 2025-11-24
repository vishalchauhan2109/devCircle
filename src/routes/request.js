const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");
const connectionRequestSchema  = require("../models/ConnectionRequest")

const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:toUserId",
    UserAuth,
    async(req,res) => {

        const allowdStatus = ["interested","ignored"]

        
        console.log(req.user._id)
        try {
            const fromUserId = req.user._id;
            // console.log(fromUserId)
            const toUserId = req.params.toUserId;
            const status = req.params.status

            if(!allowdStatus.includes(status)){
                throw new Error(`status is not correct : "${status}"`);
            }
            
            


            const connectionRequest  = new connectionRequestSchema ({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectionRequest.save();
            res.json({
                message : "conecction request send succesfully" 
            })
            res.send(data)
        } 
        catch (error){ 
            res.status(402).send("error" + error)
        }
})


module.exports = requestRouter;