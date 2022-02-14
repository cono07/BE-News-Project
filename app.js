const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

module.exports = app;

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

//Server 500 error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "server error" });
});
