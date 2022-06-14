import express from "express";
import path from "path";

const PORT = process.env.PORT || 3001;
const app = express();

app.get("/test", (req, res) => {
  res.status(200).send("Hello from server! :)");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
