const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

module.exports = app;

app.all("/*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

//Server 500 error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "server error" });
});
