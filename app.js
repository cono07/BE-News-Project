const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controllers");
const {
  handlePsqlErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

module.exports = app;

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handle500Errors);
