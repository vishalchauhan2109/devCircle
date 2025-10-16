const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstsName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
});

// const userModel = mongoose.model("User",userSchema);
// module.exports = userModel;

// or you can write it as

model.export = mongoose.model("User",userSchema);