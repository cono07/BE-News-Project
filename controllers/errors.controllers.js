exports.handlePsqlErrors = (err, req, res, next) => {
  //incorrect input or null
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "bad request" });
  }
  if (err.code === "23503") {
    res.status(400).send({ message: "bad input" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err) {
    return res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "server error" });
};
