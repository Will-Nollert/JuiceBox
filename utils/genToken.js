const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function encodeData(data) {
  const encoded = jwt.sign(data, JWT_SECRET);
  return encoded;
}

function decodeData(encodedData) {
  const data = jwt.verify(encodedData, JWT_SECRET);
  return data;
}

module.exports = {
  encodeData,
  decodeData,
};
