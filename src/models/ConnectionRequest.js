const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    
    fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        required : true
        
    },
    
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    status :{
        type : String,
        enum : {
            values :["ignore","interested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    },
} ,
      { timestamps : true}
)

// PRE METHOD
//you can write using pre (you have to crete nomal function in pre method otherwise
//  if you use arrow function it will not work )

// connectionRequestSchema.pre("save", function(){
//     const connectionRequest = this

//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         console.log("hii")
//         throw new Error("annot send the request to your own id");
//     }
//     next();
// })
module.exports = mongoose.model("request",connectionRequestSchema);