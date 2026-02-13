const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve frontend build from public folder
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("🔗 Device Linked:", socket.id);
  socket.on("cheating_alert", (data) => {
    console.log("🚨 AI Signal Received:", data.msg);
    io.emit("notify_supervisor", data);
  });
});

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(5000, () => console.log("🚀 Bridge running on Port 5000"));
