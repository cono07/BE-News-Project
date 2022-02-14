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
