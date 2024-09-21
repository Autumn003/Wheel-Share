import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  addMessage,
} from "@/actions/message.action.js";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { ErrorPage, Loader } from "../index.js";

let socket;

const Messaging = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector((state) => state.user);

  const [newMessage, setNewMessage] = useState("");

  const { userId } = useParams(); // ID of the user you are messaging
  const messageEndRef = useRef(null); // Reference to scroll to the bottom

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Fetch initial messages when component mounts
    dispatch(fetchMessages(userId));

    // Set up socket connection
    socket = io(import.meta.env.VITE_BACKEND_URL);

    // Both sender and receiver join the room for real-time updates
    socket.emit("joinRoom", { sender: currentUser._id, receiver: userId });

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      console.log("New message received via socket: ", message); // Log the message
      dispatch(addMessage(message)); // Add the new message to Redux state
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, userId, currentUser._id]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender: currentUser._id,
        receiver: userId, // Receiver is the user you are messaging
        content: newMessage,
      };

      // Emit the message via socket to the backend
      socket.emit("sendMessage", messageData);
      setNewMessage(""); // Clear input field
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;

  return (
    <div className="flex flex-col rounded-lg shadow-lg ">
      {/* Messages container */}
      <div className="flex flex-col space-y-4 overflow-auto mb-4 chat-background scrollbar-hide p-4 rounded-lg shadow-inner min-h-96 h-full">
        {messages?.map((message, index) => {
          // Handle both cases: sender as a string or an object
          const senderId =
            typeof message.sender === "string"
              ? message.sender
              : message.sender._id;

          return (
            <div
              key={index}
              className={`flex ${
                senderId === currentUser._id
                  ? "justify-end" // Sent messages aligned right
                  : "justify-start" // Received messages aligned left
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  senderId === currentUser._id
                    ? "bg-blue-500 text-white" // Sent messages styling
                    : "bg-gray-200 text-gray-900" // Received messages styling
                }`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} /> {/* Empty div to scroll into view */}
      </div>

      {/* Input container */}
      <div
        onKeyDown={handleKeyPress}
        className="flex items-center space-x-2 sticky bottom-0 p-6 bg-background shadow-[0_-4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px]"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Messaging;
