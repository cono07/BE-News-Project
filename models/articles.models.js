const db = require("../db/connection");
const topicsDev = require("../db/data/development-data/topics");
const topicsTest = require("../db/data/test-data/topics");

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

//Whitelist of accepted values to avoid sql injection/bad requests
const orderByArr = ["asc", "desc"];
const topicsArr = ["mitch", "cats", "paper"];
const articleSortBy = [
  "title",
  "topic",
  "author",
  "body",
  "created_at",
  "votes",
];

//set topics list depending on database in use (test or development)
let topicsList = [];
if (process.env.NODE_ENV === "development") {
  topicsList = topicsDev.map((topic) => {
    return topic.slug;
  });
} else if (process.env.NODE_ENV === "test") {
  topicsList = topicsTest.map((topic) => {
    return topic.slug;
  });
}

exports.fetchAllArticles = (sort_by, order, topic) => {
  const sortBy = sort_by;
  const orderBy = order;
  const topicPicker = topic;

  //reject any requests with queries that do no contain whitelisted values
  if (topicPicker && !topicsList.includes(topicPicker)) {
    return Promise.reject({
      status: 400,
      message: "bad request - topic does not exist",
    });
  }

  if (orderBy && !orderByArr.includes(orderBy)) {
    return Promise.reject({
      status: 400,
      message: "bad request - order type does not exist",
    });
  }

  if (sortBy && !articleSortBy.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      message: "bad request - sort type does not exist",
    });
  }

  let queryStr = `SELECT articles.article_id, articles.author, articles.title, articles.topic,
  articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topicPicker) {
    queryStr += ` WHERE articles.topic = '${topicPicker}'`;
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by) {
    queryStr += ` ORDER BY articles.${sortBy}`;
    if (order) {
      queryStr += ` ${orderBy}`;
    }
    queryStr += `;`;
  } else {
    queryStr += ` ORDER BY created_at DESC;`;
  }

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
