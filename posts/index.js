const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const cors = require("cors");

const port = 4000;

const posts = {};

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  res.status(201).send(posts[id]);
});

app.listen(port, () => {
  console.log("Example app listening on port: ", port);
});
