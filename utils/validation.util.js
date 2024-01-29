exports.checkAuthHeader = (req, res) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    res.status(401).send({
      success: false,
      message: "Unauthorized",
    });
    return false;
  }
  return true;
};

exports.removeUndefinedProps = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};
