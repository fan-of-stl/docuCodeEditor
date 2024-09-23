import React, { useEffect, useRef, useState } from "react";
import Client from "../Client/Client";
import Editor from "./CodeEditor/Editor";
import "./EditorPage.css";
import initSocket from "../../Utilities/socket.client";
import ACTIONS from "../../Utilities/Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state.userName,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.userName) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined the room.`);
          }
          setClients(clients);
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the Room!`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };

    const handleErrors = (e) => {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later");
      navigate("/");
    };

    init();

    // Cleanup function with a null check
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="editorMainWrapper">
      <div className="aside">
        <div className="asideInner">
          <div className="asideHeader">
            <img
              src="/docucode_logo.png"
              alt="log_project"
              className="headerImage"
            />
          </div>

          <h3>Connected</h3>

          <div className="usersList">
            {clients.map((client, index) => (
              <Client key={index} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyRoomBtn">Copy Room Id</button>

        <button className="btn  leaveRoomBtn">Leave Room</button>
      </div>
      <div className="editorWrapper">
        <Editor socketRef={socketRef} roomId={roomId} />
      </div>
    </div>
  );
};

export default EditorPage;
