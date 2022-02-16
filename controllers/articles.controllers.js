const {
  fetchArticleById,
  updateVoteByArticleId,
  checkArticleExists,
  fetchAllArticles,
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
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res
        .status(200)
        .send({
          message: "endpoint connected successfully",
          articles: articles,
        });
    })
    .catch(next);
};
