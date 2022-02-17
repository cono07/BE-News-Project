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

// const articleSortBy = [
//   "title",
//   "topic",
//   "author",
//   "body",
//   "created_at",
//   "votes",
// ];

exports.fetchAllArticles = (sort_by) => {
  const sortBy = `${sort_by}`;

  let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic,
  articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id`;

  if (sort_by) {
    queryStr += ` ORDER BY articles.${sortBy};`;
  } else {
    queryStr += ` ORDER BY created_at DESC;`;
  }

  return db.query(queryStr).then(({ rows }) => {
    console.log("return rows");
    return rows;
  });

  //WORKING FOR PREVIOUS TESTS
  // return db
  //   .query(
  //     `
  // SELECT articles.article_id, articles.author, articles.title, articles.topic,
  // articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) AS comment_count
  // FROM articles
  // LEFT JOIN comments ON comments.article_id = articles.article_id
  // GROUP BY articles.article_id;`
  //   )
  //   .then(({ rows }) => {
  //     return rows;
  //   });
};
