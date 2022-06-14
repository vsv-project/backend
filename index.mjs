import express from "express";

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

app.get("/test", (req, res) => {
  res.status(200).send("Hello from server! :)");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
