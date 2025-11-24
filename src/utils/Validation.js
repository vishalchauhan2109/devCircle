const validator = require("validator")

const validationSignup = (res) => {

    const { firstName, lastName, emailId, password } = res.body
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
        // we can also use strong password in it 
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("please enter a strong password");
    } else {
    }
};

const validateProfileEdit = (req) => {
    const EditAllowed = [
        "firstName",
        "lastName", 
        "photoURL",
        "about"
    ]

    const isEditAllowed = Object.keys(req.body).every(field => EditAllowed.includes(field))
    console.log(isEditAllowed)
    return isEditAllowed;
}

module.exports = { validationSignup , validateProfileEdit }