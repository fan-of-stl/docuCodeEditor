import { io } from "socket.io-client";

const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  console.log(process.env.REACT_APP_BACK_END_URL1);

  return io(process.env.REACT_APP_BACK_END_URL1, options);
};

export default initSocket;
