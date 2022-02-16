const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  console.log(articleId);
  fetchCommentsByArticleId(articleId)
    .then((comments) => {
      res
        .status(200)
        .send({
          message: "endpoint connected successfully",
          comments: comments,
        });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
