const express = require("express");
const { UserAuth } = require("../Middleware/UserAuth");
const { validateProfileEdit } = require("../utils/Validation");
const bcrypt = require("bcrypt")
const validator = require("validator")
const profileRouter = express.Router()

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log(user)
        res.send("user found")
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
        const loggedInUser = req.user;
        console.log(loggedInUser)

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        // console.log(req.body);
        return res.send("user updated")

    } catch {
        res.status(400).send("Error found")
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

module.exports = profileRouter;