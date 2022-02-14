const db = require("../db/connection");

exports.getAllTopics = () => {
  console.log("in models");
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};
