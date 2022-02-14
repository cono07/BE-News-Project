const { fetchArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res
        .status(200)
        .send({ article, message: "endpoint connected successfully" });
    })
    .catch(next);
};
