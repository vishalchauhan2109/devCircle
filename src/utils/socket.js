

const initilizeSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinchat", (LID, CID) => {
      const room = [LID, CID].sort().join("_"); // better
      socket.join(room);
      console.log("Joining the room:", room);
    });
    socket.on("sendMessage", ({firstName ,LID,CID,text}) => {
      const room = [LID, CID].sort().join("_"); // better
      console.log(firstName + " "+ text);
      io.to(room).emit("MessageReceived",{firstName, text})
     })
    socket.on("disconnect", () => { })



  })
};

module.exports = initilizeSocket;