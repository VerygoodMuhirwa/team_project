const jwt = require("jsonwebtoken");

const db = require("../models/teacherModel");

require("dotenv").config;

module.exports.teacherAuth = async (req, res, next) => {
  const authHeader = await req.header("Authorization");

  if (!authHeader) res.status(401).send("Unauthorized");

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.send("Unauthorized");
  }

  const decoded = await jwt.verify(token, process.env.TEACHERPRIVATEKEY);

  req.user = decoded;

  const user = await db.findOne({ _id: req.user.id });

  if (!decoded) {
    return res.status(401).json({ message: "Not authorised" });
  }
  next();
};
