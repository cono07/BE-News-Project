const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
  SELECT users.name AS author, articles.title, articles.topic, articles.article_id, articles.body, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) AS comment_count
  FROM articles 
  LEFT JOIN users ON users.username = articles.author
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY users.name, articles.article_id;`,
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

exports.fetchAllArticles = () => {
  return db
    .query(
      `
  SELECT article_id, author, title, topic, created_at, votes
  FROM articles;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
