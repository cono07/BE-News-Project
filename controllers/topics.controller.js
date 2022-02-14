const { getAllTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  getAllTopics()
    .then((topics) => {
      res
        .status(200)
        .send({ topics, message: "endpoint connected successfully" });
    })
    .catch(next);
};
