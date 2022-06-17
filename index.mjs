import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Start express
const PORT = process.env.PORT || 3001;
const app = express();

// Allow CORS
//! Change to strict domain
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Setup socket
const server = createServer(app); // Create `http` server
const io = new Server(server); // Create socket from server
const socket = io.of("/wss"); // Namespace must be 'wss'
socket.on("connection", socket => {
  console.log("connected");
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

// Test message for root
app.get("/", (req, res) => {
  res.status(200).send("Hello from server! :)");
});

// Wildcard > 404
app.get("*", (req, res) => {
  res.status(404).send("Not found.");
});

// Listen with express
server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
