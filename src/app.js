const express = require("express");
const app = express();


app.use("/hello", (req, res) => {
  res.send("Hello from the server");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test match");
});

// Root route
app.use("/", (req, res) => {
  res.send("Hello");
});

// Optionally, a fallback if you want to catch ill paths (404)
// app.use((req, res) => {
//   res.status(404).send("404 nothing Found");
// });

app.listen(2109, () => {
  console.log("your server is created ");
});
