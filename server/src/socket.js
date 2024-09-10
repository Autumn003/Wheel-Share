import { Server } from "socket.io";
import { createMessage } from "./controllers/message.controller.js";

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user conncted");

    // Join a user to  a room (could be user Id or chat room Id)
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room ${room}`);
    });

    //handle sending message
    // socket.on("sendMessage", async (data) => {
    //   try {
    //     const { sender, receiver, content, ride } = data;
    //     const message = await createMessage({
    //       sender,
    //       receiver,
    //       content,
    //       ride,
    //     });

    //     io.receiver.emit("receiveMessage", message);
    //   } catch (error) {
    //     console.log("Error sending message: ", error);
    //   }
    // });
    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, content, ride } = data;
        const message = await createMessage({
          sender,
          receiver,
          content,
          ride,
        });
        io.to(receiver).emit("receiveMessage", message); // Ensure you're emitting to the correct room
      } catch (error) {
        console.log("Error sending message: ", error);
      }
    });

    // handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default configureSocket;
