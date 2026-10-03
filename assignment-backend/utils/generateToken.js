const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Simplifying by using one token for now instead of complex refresh logic for clarity
  });
};

module.exports = generateToken;
