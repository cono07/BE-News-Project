const db = require("../db/connection");

exports.checkIfIdExists = (articleId) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 422,
          message: "does not exist",
        });
    });
};

exports.fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `
    SELECT comments.article_id, comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body
    FROM comments
    LEFT JOIN articles ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1;`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};
