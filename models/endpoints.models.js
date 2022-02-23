const fs = require("fs/promises");

exports.getEndpointsData = () => {
  let body = "";

  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    body += data.toString();
    const parsedBody = JSON.parse(body);
    return parsedBody;
  });
};
