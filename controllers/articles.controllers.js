const {
  fetchArticleById,
  updateVoteByArticleId,
  checkArticleExists,
} = require("../models/articles.models");

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

exports.updateArticleVote = (req, res, next) => {
  const { inc_votes: vote } = req.body;
  const { article_id: articleId } = req.params;
  updateVoteByArticleId(vote, articleId)
    .then((article) => {
      res
        .status(201)
        .send({ article: article, message: "updated successfully" });
    })
    .catch(next);
};
