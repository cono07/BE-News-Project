exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "bad request" });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ message: "server error" });
};
