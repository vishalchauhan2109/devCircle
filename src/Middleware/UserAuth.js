    const jwt = require("jsonwebtoken");
    const User = require("../models/User");

    const UserAuth = async (req,res,next) => {
        console.log("inside userauth")
        try {
            const {cookies} = req;
            const {token} = cookies

            if(!token){
                throw new Error("session expired");
            }

            const decode =  jwt.verify(token, "Vishal@2109");

            const id = decode._id;

            const user = await User.findOne({_id : id});
            if(!user){
                throw new Error("user not found");
            }

            req.user = user;
            // console.log(user)
            next();


        } catch{
            res.status(400).send("error")
        }
    }

    module.exports = {UserAuth}