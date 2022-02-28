const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchUsersByUsername = (username) => {
  return db
    .query(
      `
  SELECT username, avatar_url, name
  FROM users
  WHERE username = $1;`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "user does not exist",
        });
      return rows[0];
    });
};
