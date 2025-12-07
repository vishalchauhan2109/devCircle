const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");
const connectionRequestSchema = require("../models/ConnectionRequest");
const User = require("../models/User");

const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:toUserId",
    UserAuth,
    async (req, res) => {
        const allowdStatus = ["interested","ignored"]
        console.log(req.user._id)
        try {
            const fromUserId = req.user._id;
            // console.log(fromUserId)
            const toUserId = req.params.toUserId;
            const status = req.params.status
            const toUser = await User.findOne({_id : toUserId})
            console.log(toUser.firstName)

            // status can only have ["ignore","interested"] thes value 
            if (!allowdStatus.includes(status)) {
                throw new Error(`status is not correct : "${status}"`);
            }

            // if user send request to their own id
            if (fromUserId.equals(toUserId)) {
                throw new Error("Cannot send the request to your own id");
            }

            const checkUser = await User.findOne({_id : toUserId})
            console.log(checkUser)
            if(!checkUser){
                return res.status(404).send("user not found")
            }
            //cannot send request same person again or that person cannot send request to you as well
            const existingData = await connectionRequestSchema.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId }
                ],
            })
            if (existingData) {
                return res.status(500).send("request already exist")
            }
            const connectionRequest = new connectionRequestSchema({
                fromUserId,
                toUserId,
                status,
            });


            const data = await connectionRequest.save();
            res.json({
                message: `${req.user.firstName} ${status === "interested" ? "ignored":"passed"} ${toUser.firstName} profile `
            })
            res.send(data)
        }
        catch (error) {
            res.status(402).send("error" + error)
        }
    })


module.exports = requestRouter;