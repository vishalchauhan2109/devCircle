

const initilizeSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });
  io.on("connection", (socket)=>{

    socket.on("joinChat", () => {})
    socket.on("sendMessage", () => {})
    socket.on("disconnect", () => {})



  })
};

module.exports = initilizeSocket ;