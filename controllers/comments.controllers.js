const {
  fetchCommentsByArticleId,
  checkIfIdExists,
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
