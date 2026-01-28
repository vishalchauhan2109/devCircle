const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");
const connectionRequestSchema = require("../models/ConnectionRequest");
const User = require("../models/User");
// const ConnectionRequest = require("../models/ConnectionRequest");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId",
    UserAuth,
    async (req, res) => {
        const allowdStatus = ["ignored", "interested"]
        // console.log(req.user._id)

        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status
            // const toUser = await User.findOne({_id : toUserId})
            console.log(status)
            console.log(fromUserId)
            console.log(toUserId)

            // status can only have ["ignore","interested"] thes value 
            if (!allowdStatus.includes(status)) {
                throw new Error(`status is incorrect : ${status}`);
            }

            console.log("error found")
            // if user send request to their own id
            if (fromUserId.equals(toUserId)) {
                throw new Error("Cannot send the request to your own id");
            }

            const checkUser = await User.findOne({ _id: toUserId })
            console.log(checkUser)
            if (!checkUser) {
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
                message: `${req.user.firstName} ${status === "interested" ? "interested" : "ignored"} ${checkUser.firstName} profile `
            })
            res.send(data)
        }
        catch (error) {
            console.log(error)
            res.status(502).send("error" + error)
        }
    })

requestRouter.post("/request/review/:status/:id"
    , UserAuth,
    async (req, res) => {

        try {
            const allowdStatus = ["accepted", "rejected"]
            const loggedUser = req.user;
            const { status } = req.params
            const { id } = req.params

            if (!allowdStatus.includes(status)) {
                res.status(500).json({
                    message: "invalid status found"
                })
            }
            console.log(status)
            // const checkUser = await connectionRequestSchema.findone({ fromUserId: id })
            // if (!checkUser) {
            //     throw new error("User not found")
            // }

            // console.log(checkUser)
            const checkRequests = await connectionRequestSchema.findOne({
                fromUserId: id,
                toUserId: loggedUser._id,
                status: "interested"

            })
            if (!checkRequests) {
                throw new error("request not found")
            }
            console.log(checkRequests.status)
            checkRequests.status = status;
            console.log(checkRequests.status)

            await checkRequests.save();

            res.send(checkRequests)

        } catch (error) {
            res.status(500).json({
                message: "error :" + error
            })
        }

    }
)

requestRouter.get("/feed", UserAuth, async (req, res) => {

    try {
        const loggedUser = req.user




        const AlreadyExist = await connectionRequestSchema.find({
            $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }]
        }).select("fromUserId  toUserId")

        const hiddenRequest = new Set();

        AlreadyExist.forEach((a) => {
            hiddenRequest.add(a.fromUserId);
            hiddenRequest.add(a.toUserId);
        });

        console.log(hiddenRequest);
       
        const user = await User.find({
            _id: { $nin: Array.from(hiddenRequest) }
        })

        console.log(user);
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Invalid Request")
    }
})

requestRouter.get("/incomingRequest",UserAuth,async (req,res)=>{

    try{

        const loggedUser = req.user; 
        // console.log(loggedUser)

        const checkRequests = await connectionRequestSchema.find(
            {
                toUserId: loggedUser?._id,
                status : "interested"
            }
        ).select("fromUserId")

        // console.log(checkRequests)
        if(!checkRequests){
            res.json({
                message:"checkRequest error"
            })
        }

        if(checkRequests.length === 0){
            res.send("No request found")
        }

        const fui = checkRequests.map((item)=>(
            item.fromUserId
        ))
        console.log(fui);
        
        // checkRequests.forEach()
        // const data = await User.find({
        //     fromUserId : {$in : checkRequests}
        // })

        const data = await User.find({
            _id : { $in: fui }
        })

        console.log(data)
        
        res.send(data)
    }
    catch(error){

        res.status(500).send("err :" + error)
        // console.log(error)
    }
})

requestRouter.get("/friends",UserAuth,
    async(req,res) =>{

        try{
        const loggedUser = req.user;

        const friends = await  connectionRequestSchema.find({
           
           $and:[
            {
             $or:[
                {
                    toUserId:loggedUser._id
                },
                {
                    fromUserId: loggedUser._id
                }]
            },
            {
                status:"accepted"
            }
        ]
        })
        console.log(friends);
        
        console.log(friends)
        // const friend = await User.forEach((user)=>{
        //   const data =   user.find({
        //     _id: (friends.toUserId === loggedUser._id)?friends.fromUserId:friends.toUserId
        //     })

        //     console.log(data)
        // })
        const friend = friends.map((item,idx)=>{
            return (item.toUserId.toString() !== loggedUser._id.toString())?  item.toUserId:item.fromUserId
        })
        
        const data = await User.find({
            _id:friend
        })
        res.send(data)
    }
    catch(error){
        res.status(500).send("Err" + error )
    }
}
)





module.exports = requestRouter;