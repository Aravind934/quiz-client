import React, { useContext, useEffect, useState } from "react";
import "./main.css";
import { RoomContext } from "../../context/roomContext";
import { socket } from "../../utils";
import { toast } from "react-toastify";

function Main() {
  let { roomDetail, rooms, setRoomDetail } = useContext(RoomContext);
  let [count, setCount] = useState(0);
  let [quiz, setQuiz] = useState(null);
  let [prevQIDs, setPrevQIDs] = useState([]);
  const [points, setPoints] = useState(0);
  let [qNo, setQNo] = useState(0);
  const [interval, setIntervalValue] = useState(null);
  const startQuiz = () => {
    if (interval) {
      clearInterval(interval);
      setIntervalValue(null);
    }
    if (qNo >= 5) {
      setQNo(0);
      setCount(0);
      setQuiz(null);
      setPoints(0);
      setRoomDetail({ joinedRoom: false, room: "" });
      socket.emit("removeRoom");
      toast.info(`Your score is : ${points}`);
    }
    let temp = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    setIntervalValue(temp);
    setQNo((prev) => prev + 1);
    setCount(0);
    socket.emit("startQuiz", { quiz, qNo, prevQIDs });
  };
  useEffect(() => {
    if (count === 10) {
      clearInterval(interval);
      setIntervalValue(null);
    }
  }, [count]);
  useEffect(() => {
    socket.on("startQuiz", (res) => {
      setQuiz(res?.question);
      setPrevQIDs((prev) => [...prev, res?.question?.id]);
    });
  }, []);
  const startGame = () => {
    let temp = rooms?.find((room) => room?.name === roomDetail?.room);
    return temp?.Players?.length >= 2;
  };
  if (!roomDetail?.joinedRoom || !startGame())
    return (
      <div className="main-start">
        <div className="container">
          <h4>
            {!startGame() && roomDetail?.joinedRoom
              ? `Wait till your opponent joined`
              : `Please join any room`}
          </h4>
        </div>
      </div>
    );
  {
  }
  if (!quiz)
    return (
      <div className="main-start">
        <div className="container">
          <button onClick={startQuiz}>Start quiz</button>
        </div>
      </div>
    );
  return (
    <div className="main">
      <div className="ques-details">
        <p>Points : 0</p>
        <div className="timer">{count}</div>
      </div>
      <div className="question">{`${qNo} )${quiz?.question}`}</div>
      <div className="options">
        {quiz?.QuestionOptions?.map((item) => {
          return (
            <>
              <input type="radio" value={item?.option} /> {item?.option} <br />
            </>
          );
        })}
        <br />
      </div>
      <div className="submit-btn">
        <button onClick={startQuiz}>{`Next  `}</button>
        <button disabled={count >= 10}>Submit</button>
      </div>
    </div>
  );
}

export default Main;
