const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const accessToken = await jwt.verify(token, process.env.SECRET);
    req.user = accessToken;
    if (accessToken) {
      next();
    } else res.status(403).json("You are not denied access!");
  } else return res.status(401).json("You are not authenticated!");
};

const verifyAndAuthorizeUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.sub === req.params.id || req.user.isAdmin) {
      next();
    } else return res.status(403).json();
  });
};

const verifyAndAuthorizeAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else return res.status(403).json("You are not allowed to do that!");
  });
};

module.exports = {
  verifyAndAuthorizeUser,
  verifyToken,
  verifyAndAuthorizeAdmin,
};
