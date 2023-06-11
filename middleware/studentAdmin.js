module.exports.studentAdmin = async (req, res, next) => {
  if (!req.role === "student") return res.status(401).send("Not authorised");
  next();
};
