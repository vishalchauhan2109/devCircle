const express = require("express");
const DB = require("./Config/database")
const app = express();
const User = require("./models/User");



app.use(express.json())

app.post("/status", async (req,res)=>{
  console.log(req.body)
  const user = new User(req.body)
  try {
  await user.save()
  res.send("new user added")
  }
  catch (err) {
    res.status(402).send(err.message)
  }
})





DB()
  .then(() => {
    console.log("database is connected");
    
    app.listen(2100, () => {
      console.log("your server is created ");
    });
  })
  .catch((error) => {
    console.log("error");
    
  });

