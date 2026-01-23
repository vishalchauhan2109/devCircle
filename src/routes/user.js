const express = require("express");

const User = express.Router();
const { UserAuth } = require("../Middleware/UserAuth");

User.get(
    "/user/connection/:id",
    UserAuth,
    async (req,res)=>{
        
    
    }
)

module.exports = User;