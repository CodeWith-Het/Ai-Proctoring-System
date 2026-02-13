import React from "react";

const CameraFeed = () => {
  return (
    <div className="w-full bg-black rounded-xl overflow-hidden border-4 border-slate-700 shadow-lg mb-8 relative">
      <div className="absolute top-2 left-2 bg-red-600 px-3 py-1 text-xs font-bold text-white rounded animate-pulse z-10">
        LIVE
      </div>

      <img
        src="https://sharolyn-overreactive-canorously.ngrok-free.dev/video_feed"
        alt="AI Video Feed"
        className="w-full h-[400px] object-contain block"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/800x400?text=Check+Ngrok+Link...";
        }}
      />

      <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">
        Source: AI Remote Engine
      </div>
    </div>
  );
};

export default CameraFeed;
