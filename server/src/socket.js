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
    // Join a room for a specific conversation
    socket.on("joinRoom", ({ sender, receiver }) => {
      // Create a unique room ID based on sender and receiver IDs
      const room = [sender, receiver].sort().join("_");
      socket.join(room);
    });

    // Handle sending a message
    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, content, ride } = data;

        // Create the message in the database
        const message = await createMessage({
          sender,
          receiver,
          content,
          ride,
        });

        // Create a unique room ID based on sender and receiver IDs
        const room = [sender, receiver].sort().join("_");

        // Emit the message to both sender and receiver's room
        io.to(room).emit("receiveMessage", message);
      } catch (error) {}
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default configureSocket;
