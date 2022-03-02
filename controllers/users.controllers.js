const { fetchUsers, fetchUsersByUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res
        .status(200)
        .send({ message: "endpoint connected successfully", users: users });
    })
    .catch(next);
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUsersByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch(next);
};
