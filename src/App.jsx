import { useState, useEffect, useRef } from "react";
import "./App.css";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function App() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [task, setTask] = useState("");
  const [sessions, setSessions] = useState([]);

  const audioRef = useRef(null);

  // Timer Logic
  useEffect(() => {
    let timer;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      handleSessionEnd();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  
  useEffect(() => {
    document.title = `${formatTime()} - FocusFlow`;
  }, [timeLeft]);

  const handleSessionEnd = () => {
    // Play sound
    audioRef.current.play().catch(() => {});

    if (mode === "work") {
      setSessions((prev) => [
        ...prev,
        { task: task || "No Task", time: new Date().toLocaleTimeString() },
      ]);
      setMode("break");
      setTimeLeft(BREAK_TIME);
    } else {
      setMode("work");
      setTimeLeft(WORK_TIME);
    }

    setIsRunning(false);
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>FocusFlow</h1>

        <input
          type="text"
          placeholder="What are you working on?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        {/* Timer Circle */}
        <div className="timer-circle">
          {formatTime()}
        </div>

        {/* Controls */}
        <div className="controls">
          <button onClick={() => setIsRunning(true)}>Start</button>
          <button onClick={() => setIsRunning(false)}>Pause</button>
          <button onClick={resetTimer}>Reset</button>
        </div>

        {/* Mode Display */}
        <div className="mode">
          {mode === "work" ? "🚀 Deep Focus Mode" : "🌿 Break Time"}
        </div>

        {/* Sessions */}
        <h3>Sessions</h3>
        <ul>
          {sessions.map((s, i) => (
            <li key={i}>
              {s.task} — {s.time}
            </li>
          ))}
        </ul>

        {/* Audio */}
        <audio
          ref={audioRef}
          src="https://www.soundjay.com/buttons/beep-07.wav"
        />
      </div>
    </div>
  );
}