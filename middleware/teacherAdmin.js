module.exports.teacherAdmin = async (req, res, next) => {
  if (!req.role=== "teacher") return res.status(401).send("Not authorised");
  next();
};
