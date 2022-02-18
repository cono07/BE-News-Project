const {
  fetchCommentsByArticleId,
  checkIfIdExists,
  insertCommentByArticleId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([fetchCommentsByArticleId(articleId), checkIfIdExists(articleId)])
    .then(([comments]) => {
      res.status(200).send({
        message: "endpoint connected successfully",
        comments: comments,
      });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body: comment } = req.body;
  const { article_id: articleId } = req.params;

  insertCommentByArticleId(articleId, username, comment)
    .then((comment) => {
      res
        .status(201)
        .send({ comment, message: "commented posted successfully" });
    })
    .catch(next);
};
