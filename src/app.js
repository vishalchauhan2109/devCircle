const express = require("express");
const DB = require("./Config/database");
const app = express();
const User = require("./models/User");

app.use(express.json());

// To add user to your database
app.post("/addUser", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("new user added");
  } catch (err) {
    res.status(402).send(err.message);
  }
});


// to delete one user from database
app.delete("/delete", async (req, res) => {
  const userName = req.body.firstName;
  
  try {
   
      const user = await User.deleteOne({ firstName: userName });
      console.log(user);
    if (user.deletedCount != 0) {
      res.send(user);
    }else{
      console.log("user not found");
      res.send("user not found");
    }
  } catch (error) {
    res.status(402);
  }
});

// to update  one user b we use updateone
app.patch("/update" , async (req,res)=>{
  const userName = req.body.firstName;
  const data = req.body
  try {
    const user = await User.updateOne({ firstName: userName},data)
    res.send(user);
  } catch (error) {
    res.send(error)
  }
})


//get user by email find user by emailID
app.get("/find", async (req, res) => {
  // const Email = req.body.emailId;
  // console.log("", Email)

  try {
    const user = await User.find({ firstName: req.body });
    res.send(user);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

// feed api
app.get("/feed", async (req, res) => {
  // const Email = req.body.emailId;
  // console.log("", Email)

  try {
    const user = await User.find({ });
    res.send(user);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.get("/findone", async (req, res) => {
  const username = req.body.firstName;
  console.log(username);

  try {
    const user = await User.findOne({ firstName: username }).exec();
    res.send(user);
  } catch {
    res.status(400).send("something went wrong!!!");
  }
});

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
