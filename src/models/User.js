const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength:3,
    maxLength:15,
  },
  lastName: {
    type: String,
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase : true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate(value){
      if(value < 18){
        throw new Error("beta padhai kro");
      }
    }
  },

  photoURL: {
    type: String,
  },

  about:{
    type: String,
    default: "this is my default bio",
  },
},{
  timestamps: true,
}
)
// const userModel = mongoose.model("User",userSchema);
// module.exports = userModel;

// or you can write it as

module.exports = mongoose.model("User",userSchema);