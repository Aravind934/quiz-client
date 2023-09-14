import { io } from "socket.io-client";

const socket = io("http://localhost:8000/");

socket.emit("msg", "Hi");

socket.on("connect", () => {
  console.log(socket.connected); // true
});

socket.on("disconnect", () => {
  console.log(socket.connected); // false
});

export { socket };
