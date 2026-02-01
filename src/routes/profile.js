const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");
const { validateProfileEdit } = require("../utils/Validation");
const bcrypt = require("bcrypt")
const validator = require("validator");
const User = require("../models/User");
const profileRouter = express.Router()

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user)
        res.send(user)
    } catch {
        res.status(402).send("error")
    }
})

//profile edit
profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {

    try {
        if (!validateProfileEdit(req)) {
            throw new console.error("request not valid");
        }

        console.log(validateProfileEdit)
        const loggedInUser = req.user;
        console.log(req.body)

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        console.log(loggedInUser);

        let updatedData = await loggedInUser.save();
        return res.status(201).json({
            status : 200,
            data : updatedData
        })

    } catch(err) {
        res.status(400).send("Error found" + err)
    }
})

// profile password edit
profileRouter.patch("/profile/passwordedit", UserAuth, async (req, res) => {
    const loggedInUser = req.user ;
    let oldPassword = req.user.password
    console.log(oldPassword)
    try {
        const newPassword = req.body.password;
        console.log(newPassword)
        // any password not found
        if (!newPassword || !oldPassword) {
            throw new Error("please fill the password");
        }

        // check old password and new password must not be same 
        const checkpass = await bcrypt.compare(newPassword, oldPassword)
        if (checkpass) {
            throw new Error("New password cannot be same as old password");
        }

        //check if the password is valid
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("please enter a strong password");
        }
        const storedPassword = await bcrypt.hashSync(newPassword, 10);
        oldPassword = storedPassword;      
        res.send(loggedInUser)
    } catch (error) {
        res.status(500).
            json({
                message: `${error}`
            })
    }
})

profileRouter.get("/user/:id", UserAuth,
    async (req,res)=>{

        try{

        const {id} = req.params;
        // console.log(id)
    //     if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: "Invalid user ID" });
    // }
        const user = await User.findById(id)

        console.log(user);
        
        if(!user){
            throw new error("user not found")
        }
        res.send(user)
        

        }catch(error){
            res.status(500).send("Error"+" "+error)
        }

    }
)

module.exports = profileRouter;