const express = require("express");
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
const { getUsers } = require("./controllers/users.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);

app.patch("/api/articles/:article_id", updateArticleVote);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
