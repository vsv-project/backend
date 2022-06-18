import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Start express
const PORT = process.env.PORT || 3001;
const app = express();
const CONFIG = JSON.parse(process.env.CONFIG) 

const firebase = initializeApp(CONFIG)
const auth = getAuth(firebase)

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
  socket.on("signup", (credentials) => {
    console.log(credentials);  // {email, password}
    const {email, password} = credentials;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully. 
      const user = userCredential.user
      const status = "success"
      console.log(user)
      socket.emit("signup", {timestamp: new Date().toUTCString(), status: status, data: {user: user}});
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const status = "failure"
      console.log(errorCode, errorMessage);
      socket.emit("signup", {timestamp: new Date().toUTCString(), status: status, data: {error: {errorCode: errorMessage}}});
    });
    socket.on("login", (credentials) => {
      console.log(credentials);  // {email, password}
      const {email, password} = credentials;
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user
        const status = "success";
        console.log(user);
        socket.emit("login", {timestamp: new Date().toUTCString(), status: status, data: {user: user}});
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const status = "failure";
        console.log(errorCode, errorMessage);
        socket.emit("signup", {timestamp: new Date().toUTCString(), status: status, data: {error: {errorCode: errorMessage}}});
      });
    })
    socket.on("signout", () => {
      signOut(auth)
      .then(() => {
        // Sign-out successful.
        const status = "success";
        socket.emit("signout", {timestamp: new Date().toUTCString(), status: status, data: {}});
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const status = "failure";
        socket.emit("signout", {timestamp: new Date().toUTCString(), status: status, data: {error: {errorCode: errorMessage}}});
      });
    })
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
