import React from "react";
import "./Client.css";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client">
      <Avatar name={username} size={30} round=".25rem" />
      <span className="userName">{username}</span>
    </div>
  );
};

export default Client;
