const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");

const PostSchema = require("../models/Posts");
const postRouter = express.Router();
const { Upload } = require("../Middleware/Multer");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");
postRouter.post(
  "/posts/createpost/:id",
  UserAuth,
  Upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { caption } = req.body;
      const { image } = req.body;
      const loggedUserId = req.user._id.toString();

      if (id !== loggedUserId) {
        return res.status(403).send("Wrong user");
      }

      if (!caption && !req.file) {
        return res.status(400).send("post must contain image or caption");
      }

      const post = new PostSchema({
        userId: id,
        caption,
        image: req.file ? req.file.path : null,
      });

      await post.save();

      res.status(201).json(post);
    } catch (err) {
      res.status(400).send("Error: " + err);
    }
  },
);

postRouter.get("/HomeFeed/:id", UserAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      throw new Error("id not found");
    }
    console.log(user);

    const post = await ConnectionRequest.find({
      $or: [
        {
          toUserId: id,
          fromUserId: id,
        },
        { status: "accepted" },
      ],
    })
    // .select( (user.fromUserId.toString() === id) ?user.toUserId.toString(): user.fromUserId.toString())
        
        const connectionId = post.map((item)=>{
          return (item.fromUserId.toString() === id) ? item.toUserId.toString(): item.fromUserId.toString()
        })
     if (!connectionId) {
      throw new Error("error on post searching");
    }

    if (connectionId.length === 0) {
      res.send("No post found");
    }

    const UserProfile = await User.find({
      _id:connectionId
    })
        console.log(UserProfile)

    const newposts = await PostSchema.find({
     userId:{$in: connectionId } 
    })

    console.log(connectionId)
    

    res.send({newposts,UserProfile});
  } catch (error) {
    res.status(402).send("Error :" + error);
  }
});

module.exports = postRouter;
