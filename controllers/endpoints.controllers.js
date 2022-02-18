const { getEndpointsData } = require("../models/endpoints.models");

exports.getApiEndpoints = (req, res, next) => {
  getEndpointsData()
    .then((endPoints) => {
      res.status(200).send({ endPoints });
    })
    .catch((err) => {
      next(err);
    });
};
