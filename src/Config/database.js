const mongoose = require("mongoose");

const DB = async () => {
  await mongoose.connect
(
"mongodb+srv://vishalchauhan2109_db_user:vishal2109@devcircle.dodyeow.mongodb.net/?retryWrites=true&w=majority&appName=DevCircle/devCircle/devCircle"  
)}

module.exports = DB;