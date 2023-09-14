import "./App.css";
import Header from "./container/header";
import Rooms from "./container/rooms";
import Main from "./container/main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoomContext } from "./context/roomContext";
import { useState } from "react";

function App() {
  const [rooms, setRooms] = useState([]);
  const [roomDetail, setRoomDetail] = useState({ joinedRoom: false, room: "" });
  return (
    <div className="App">
      <ToastContainer />
      <Header />
      <RoomContext.Provider
        value={{ roomDetail, setRoomDetail, rooms, setRooms }}
      >
        <div className="grid">
          <Rooms />
          <Main />
        </div>
      </RoomContext.Provider>
    </div>
  );
}

export default App;
