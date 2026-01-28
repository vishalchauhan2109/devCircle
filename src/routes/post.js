const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");

const PostSchema = require("../models/Posts");
const postRouter = express.Router();
const { Upload } = require("../Middleware/Multer");
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
        image: req.file? req.file.path : null ,
      });

      await post.save();

      res.status(201).json(post);
    } catch (err) {
      res.status(400).send("Error: " + err);
    }
  },
);

module.exports = postRouter;
