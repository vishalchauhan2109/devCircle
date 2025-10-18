const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
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

module.exports = mongoose.model("User",userSchema);