const mongoose = require("mongoose");
// const { validate } = require("./User");
const validator = require("validator");


const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  caption: {
    type : String,
    maxlength:1000,
    minlength:3,
    required:true
  },

  image: {
    type: String,
    default:null,
    // required:true,
    // validate(value) {
    //   if (!validator.isURL(value)) {
    //     throw new Error("please provide a valid image");
    //   }
    // },
  },
  
  // user: {
  //   type: 
  // }

  // like:[{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref:"User",
  //   unique:true,
  // }],

  // comments: [
  //     {
  //       userId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "User",
  //       },
  //       text: {
  //         type: String,
  //         required: true,
  //       },
  //       createdAt: {
  //         type: Date,
  //         default: Date.now,
  //       },
  //     },
  //   ],
},{timestamps:true}
);
module.exports = mongoose.model("Post",PostSchema);