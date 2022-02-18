const fs = require("fs/promises");

exports.getEndpointsData = () => {
  let body = "";

  return fs
    .readFile("./endpoints.json", "utf-8")
    .then((data) => {
      body += data.toString();
      return body;
    })
    .then((data) => {
      const parsedBody = JSON.parse(data);
      return parsedBody;
    });
};
