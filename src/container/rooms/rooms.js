import React, { useContext, useEffect } from "react";
import "./rooms.css";
import { socket } from "../../utils";
import { toast } from "react-toastify";
import { RoomContext } from "../../context/roomContext";

function Rooms() {
  const { roomDetail, setRoomDetail, rooms, setRooms } =
    useContext(RoomContext);
  let showCreateBtn = true;
  const createRoom = () => {
    socket.emit("createRoom");
  };
  const joinRoom = (room) => {
    socket.emit("joinRoom", room);
  };
  const selected = (room) => {
    return room?.name === roomDetail?.room;
  };
  useEffect(() => {
    socket.emit("getRooms");

    socket.on("getRooms", (data) => {
      if (!data?.success) return toast.error(data?.msg);
      setRooms(data?.data);
    });

    socket.on("createRoom", (data) => {
      if (!data?.success) return toast.error(data?.msg);
      else {
        toast.success("New room created!");
        socket.emit("getRooms");
      }
    });

    socket.on("refetchRooms", (data) => {
      socket.emit("getRooms");
    });

    socket.on("joinRoom", (res) => {
      if (!res?.success) return toast.error(res?.msg);
      toast.success("Joined successfully!");
      setRoomDetail({ joinedRoom: true, room: res?.room });
      socket.emit("getRooms");
    });

    socket.on("roomDeleted", () => {
      socket.emit("getRooms");
    });
  }, []);
  if (!rooms.length)
    return (
      <>
        <div className="rooms no-rooms">
          <div>
            <h3>No rooms found</h3>
            <div className="button">
              <button onClick={() => createRoom()}>Create room</button>
            </div>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div className="rooms">
        {rooms.map((room, i) => (
          <div
            className="room"
            key={i}
            style={{
              background: selected(room) ? "rgb(231, 227, 227)" : null,
            }}
          >
            <div className="room-details">
              <div> {room?.name}</div>
              <div className="user-available">
                {" "}
                {room?.Players?.length}/2 Players
              </div>
            </div>

            <div className="join-button">
              <button
                onClick={() => joinRoom({ room })}
                disabled={room?.Players?.length >= 2 || selected(room)}
              >
                Join
              </button>
            </div>
          </div>
        ))}
        {showCreateBtn && (
          <div className="button">
            <button onClick={createRoom}>Create room</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Rooms;
