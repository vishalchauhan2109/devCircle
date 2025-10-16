const express = require("express");
const DB = require("./Config/database")
const app = express();

app.use("/",(req,res)=>{
  res.send("server started");
})


DB()
  .then(() => {
    console.log("database is connected");
    app.listen(2100, () => {
      console.log("your server is created ");
    });
  })
  .catch((error) => {
    console.log(console.error);
  });

