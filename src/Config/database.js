const mongoose = require("mongoose");
const DB = async () => {
  await mongoose.connect
(
// "mongodb+srv://vishalchauhan2109_db_user:vishal2109@devcircle.dodyeow.mongodb.net/?appName=dev"
"mongodb+srv://vishalchauhan2109_db_user:vishal2109@devcircle.dodyeow.mongodb.net/devCircle?appName=DevCircle"
// "mongodb+srv://vishalchauhan2109_db_user:vishal2109@devcircle.dodyeow.mongodb.net/?retryWrites=true&w=majority&appName=DevCircle/devCircle/users"  
)}
module.exports = DB;