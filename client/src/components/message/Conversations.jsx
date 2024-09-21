import { fetchConversations } from "@/actions/message.action";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ErrorPage, Loader } from "../index.js";

const Conversations = () => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(
    (state) => state.conversation
  );
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;

  return (
    <div className="p-4">
      {conversations.map((conversation) => {
        const isUserReceiver = conversation._id.receiver === user._id;
        const chatPartnerId = isUserReceiver
          ? conversation._id.sender
          : conversation._id.receiver;

        return (
          <Link
            to={`/messages/${chatPartnerId}`}
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
        );
      })}
    </div>
  );
};

export default Conversations;
