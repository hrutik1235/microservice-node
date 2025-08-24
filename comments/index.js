const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const port = 4001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);
  res.send({});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
