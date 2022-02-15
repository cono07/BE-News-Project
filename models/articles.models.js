const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
  SELECT users.name AS author, title, topic, article_id, body, topic, created_at, votes
  FROM articles 
  LEFT JOIN users ON users.username = articles.author
  WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVoteByArticleId = (vote, articleId) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
      `,
      [vote, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "article does not exist",
        });
      return rows[0];
    });
};
