import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER);

socket.emit("msg", "Hi");

socket.on("connect", () => {
  console.log(socket.connected); // true
});

socket.on("disconnect", () => {
  console.log(socket.connected); // false
});

export { socket };
