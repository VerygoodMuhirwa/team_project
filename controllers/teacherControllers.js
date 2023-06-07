const bcrypt = require("bcrypt");
const Joi = require("joi");
const schoolDb= require("../models/schoolModel")
const teacherDb = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const validateTeacher = (item) => {
  const Schema = new Joi.object({
    teacherName: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
      .message(
        " the password must contain at least one alphabet, one digit, and one special character from the set !@#$%^&*. It should also be at least 6 characters long. If the password doesn"
      ),
    lessons: Joi.string().required(),
    className: Joi.string().required(),
  });

  return Schema.validate(item);
};


//This is the function to generate the token for the teacher 
const generateAuthToken = (id) => {
  const token = jwt.sign({ id: id, isAdmin: true }, process.env.JWTPRIVATEKEY, {
    expiresIn: "1d",
  });
  return token;
};

router.post("/registerTeacher",async (req, res) => {
  const { error } = validateTeacher(req.body);
  if (error) return res.status(404).json({ error: error.details[0].message });

  const { teacherName, email, password, lessons } = req.body;

  const teacherExists = await teacherDb.findOne({ email });
  if (teacherExists) {
    return res.status(409).send("The student with that email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);

  const newTeacher = await teacherDb.create({
    email,
    teacherName,
    password: harshedPassword,
    lessons,
  });
  if (!newTeacher)
    return res
      .status(404)
      .json({ message: "Faced an error when creating a teacher account " });
  
  const teacherCount = await schoolDb.findOne({})
  teacherCount.totalTeachers += 1

  await teacherCount.save();
  return res.status(201).send(newTeacher);
}
)


router.post("/loginTeacher", async (req, res) => {
    const { email, password } = req.body;
    const teacherExists = await teacherDb.findOne({ email });
    if (!teacherExists) {
        return res.status(404).send("Invalid email or password");
    }

    const salt = await bcrypt.genSalt(10);
    const harshedPassword = await bcrypt.hash(password, salt);

    if (!teacherExists.password == harshedPassword) {
        return res.status(404).send("Invalid email or password");
    }

    const token = await generateAuthToken(teacherExists._id);
    return res
        .status(200)
        .send({ message: "logged in successfully", Token: token });
}
)




module.exports = router
