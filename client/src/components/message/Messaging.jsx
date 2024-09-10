// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMessages, sendMessage } from "@/actions/message.action.js";
// import io from "socket.io-client";
// import { useParams } from "react-router-dom";

// const Messaging = () => {
//   const dispatch = useDispatch();
//   const { messages, loading, error } = useSelector((state) => state.messages);
//   const { user: currentUser } = useSelector((state) => state.user);

//   const [newMessage, setNewMessage] = useState("");
//   const { userId } = useParams();

//   useEffect(() => {
//     dispatch(fetchMessages(userId));

//     const socket = io(import.meta.env.VITE_BACKEND_URL);

//     socket.emit("joinRoom", userId);

//     socket.on("receiveMessage", (message) => {
//       dispatch(fetchMessages(userId));
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [dispatch, userId]);

//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       await dispatch(sendMessage({ receiver: userId, content: newMessage }));
//       setNewMessage("");
//     }
//   };

//   if (loading) return <div>Loading messages...</div>;
//   if (error) return <div>Error loading messages</div>;

//   return (
//     <div className="messaging-container">
//       <div className="messages-list">
//         {messages?.data?.map((message, index) => (
//           <div
//             key={index}
//             className={`message-item ${message.sender === currentUser?._id ? "sent" : "received"}`}
//           >
//             {message.content}
//           </div>
//         ))}
//       </div>
//       <div className="message-input-container">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Messaging;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  addMessage,
} from "@/actions/message.action.js";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Messaging = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector((state) => state.user);

  const [newMessage, setNewMessage] = useState("");

  const { userId } = useParams();
  console.log(userId);

  //   useEffect(() => {
  //     dispatch(fetchMessages(userId));

  //     const socket = io(import.meta.env.VITE_BACKEND_URL);

  //     socket.emit("joinRoom", userId);

  //     socket.on("receiveMessage", (message) => {
  //       dispatch(addMessage(message)); // Directly update the state with the new message
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, [dispatch, userId]);

  useEffect(() => {
    // Fetch initial messages when component mounts
    dispatch(fetchMessages(userId));

    // Set up socket connection
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    // Join the room
    socket.emit("joinRoom", userId);

    // On receiving a message, directly update the Redux state
    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message)); // Add the new message directly to state
    });

    return () => {
      // Clean up the socket connection
      socket.disconnect();
    };
  }, [dispatch, userId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(sendMessage({ receiver: userId, content: newMessage }));
      setNewMessage("");
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error loading messages</div>;

  return (
    <div className="messaging-container">
      <div className="messages-list">
        {messages?.data?.map((message, index) => (
          <div
            key={index}
            className={`message-item ${message.sender === currentUser?._id ? "sent" : "received"}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messaging;
