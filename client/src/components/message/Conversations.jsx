import { fetchConversations } from "@/actions/message.action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Conversations = () => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(
    (state) => state.conversation
  );
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error loading conversations</div>;

  return (
    <div className="p-4">
      {conversations.map((conversation) => (
        <Link
          to={`/messages/${conversation._id.receiver}`}
          key={conversation?.lastMessage?._id}
        >
          <div
            key={conversation?.lastMessage?._id}
            className="mb-4 p-4 border rounded-lg shadow-md"
          >
            <h2 className="text-lg font-bold">{conversation?.receiver}</h2>
            <p>{conversation?.lastMessage?.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Conversations;
