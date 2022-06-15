import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3001;
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});
const server = createServer(app);

const io = new Server(server)

app.get("/test", (req, res) => {
  res.status(200).send("Hello from server! :)");
});

app.get('*', (req, res) => {
  res.status(400).send("Bad request :(")
  return
});
server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
