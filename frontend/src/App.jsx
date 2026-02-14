import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import AlertBox from "./components/AlertBox";
import CameraFeed from "./components/CameraFeed";
import SeatControls from "./components/SeatControls";
import SeatGrid from "./components/SeatGrid";

const socket = io("https://ai-proctoring-system-k2vt.onrender.com");

function App() {
  const [seats, setSeats] = useState([]);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    socket.on("notify_supervisor", (data) => {
      setAlertMsg(`${data.msg} at Seat ${data.seatIndex + 1}`);
      setTimeout(() => setAlertMsg(null), 5000);
      markSeatCheating(data.seatIndex);
    });

    return () => socket.off("notify_supervisor");
  }, [seats]);

  // Fucntions
  const markSeatCheating = (index) => {
    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      if (newSeats[index]) {
        newSeats[index] = { ...newSeats[index], isCheating: true };
      }
      return newSeats;
    });
  };

  // The warning Part
  const handleResetSeat = (index) => {
    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      if (newSeats[index]) {
        newSeats[index] = { ...newSeats[index], isCheating: false };
      }
      return newSeats;
    });
  };

  // Adds a specific number of seats
  const addSeats = (count) => {
    const newSeats = Array.from({ length: count }, (_, i) => ({
      id: seats.length + i + 1,
      isCheating: false,
    }));
    setSeats([...seats, ...newSeats]);
  };

  // reset all seats
  const clearRoom = () => {
    setSeats([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
  
        <header className="mb-6 border-b border-slate-700 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 tracking-tight">
              🛡️ AI Proctoring System
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time Exam Hall Monitor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-mono text-green-400">
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        <AlertBox message={alertMsg} />

        <CameraFeed />

        <SeatControls onAddSeats={addSeats} onClearRoom={clearRoom} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-300">
            Classroom Layout
          </h2>
          <SeatGrid seats={seats} onResetSeat={handleResetSeat} />
        </div>
      </div>
    </div>
  );
}

export default App;
