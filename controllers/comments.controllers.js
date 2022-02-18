const {
  fetchCommentsByArticleId,
  checkIfIdExists,
  insertCommentByArticleId,
  deleteComment,
  checkCommentIdExists,
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id: commentId } = req.params;

  Promise.all([deleteComment(commentId), checkCommentIdExists(commentId)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
