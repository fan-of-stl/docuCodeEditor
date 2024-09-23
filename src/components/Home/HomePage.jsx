import React, { useState } from "react";
import "./Homepage.css";
import Footer from "../Footer/Footer";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  const [userName, setUserName] = useState("");

  const handleRoomIdInput = (e) => {
    e.preventDefault();
    setRoomId((prev) => (prev = e.target.value));
  };

  const handleUserNameInput = (e) => {
    e.preventDefault();
    setUserName((prev) => (prev = e.target.value));
  };

  const handleJoinButton = () => {
    if (!roomId || !userName) {
      toast.error("Please enter both room id and username");

      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { userName },
    });
  };

  const createNewRoom = (e) => {
    e.preventDefault();

    const uuid = v4();

    setRoomId((prev) => (prev = uuid));

    toast.success("Created new room!");
  };

  const handleKeyUpForInput = (e) => {
    if (e.code === "Enter") {
      handleJoinButton();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="image-wrapper">
          <img src="/docucode_logo.png" alt="logo" className="project-logo" />
        </div>
        <h4 className="label">Paste invitaion ROOM ID</h4>

        <div className="inputGroup">
          <input
            type="text"
            className="inputBox roomId"
            onChange={handleRoomIdInput}
            value={roomId}
            onKeyUp={handleKeyUpForInput}
            placeholder="ROOM ID"
          />
          <input
            type="text"
            className="inputBox userName"
            onChange={handleUserNameInput}
            value={userName}
            onKeyUp={handleKeyUpForInput}
            placeholder="USER NAME"
          />

          <button onClick={handleJoinButton} className="btn joinBtn">
            Join
          </button>
        </div>

        <div className="info">
          If you don't have invite then create &nbsp;{" "}
          <a
            onClick={createNewRoom}
            href="/create-room"
            className="newRoomAnchor"
          >
            Create Room
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
