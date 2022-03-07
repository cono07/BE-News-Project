const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  updateArticleVote,
  getAllArticles,
} = require("./controllers/articles.controllers");
const {
  handlePsqlErrors,
  handle500Errors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const {
  getUsers,
  getUsersByUsername,
} = require("./controllers/users.controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  updateCommentVote,
} = require("./controllers/comments.controllers");

const { getApiEndpoints } = require("./controllers/endpoints.controllers");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api", getApiEndpoints);
app.get("/api/users/:username", getUsersByUsername);

app.patch("/api/articles/:article_id", updateArticleVote);
app.patch("/api/comments/:comment_id", updateCommentVote);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
