const db = require("../db/connection");

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
