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
          status: 404,
          message: "article does not exist",
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

exports.insertCommentByArticleId = (articleId, username, comment) => {
  return db
    .query(
      `
  INSERT INTO comments (author, body, article_id)
  VALUES (
    $1, $2, $3
  ) RETURNING body;
  `,
      [username, comment, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteComment = (commentId) => {
  return db
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1 RETURNING *;`,
      [commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 400,
          message: "bad request - comment does not exist",
        });
    });
};
