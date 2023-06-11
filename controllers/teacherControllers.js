const bcrypt = require("bcrypt");
const Joi = require("joi");
const schoolDb= require("../models/schoolModel")
const teacherDb = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
const express = require("express");
const lessonModel = require("../models/lessonModel");

const teachersModel = require("../models/teachersModel");
const { admin } = require("../middleware/admin")
const {auth}= require("../middleware/auth")
const classesModel = require("../models/classesModel");
const teacherModel = require("../models/teacherModel");
const router = express.Router();
const validateTeacher = (item) => {
  const Schema = new Joi.object({
    teacherName: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
    lessonName: Joi.string().required(),
      className:Joi.string().required()
  });

  return Schema.validate(item);
};






//This is the function to generate the token for the teacher 
const generateAuthToken = (item) => {
  const token = jwt.sign({ id: this._id, lessonName:this.lessonName ,role:"teacher" }, process.env.TEACHERPRIVATEKEY, {
    expiresIn: "1d",
  });
  return token;
};

router.post("/registerTeacher",async (req, res) => {
  const { error } = validateTeacher(req.body);
  if (error) return res.status(404).json({ error: error.details[0].message });

try {
  const { teacherName, email, password, lessonName, className } = req.body;
  console.log(req.body);
  const teacherExists = await teacherDb.findOne({ email });
  if (teacherExists) {
    return res.status(409).send("The teacher with that email already exists");
  }

  const lessonExists = await lessonModel.findOne({ lessonName });
  if (!lessonExists)
    return res.status(404).json({ message: "The lesson not found " });

  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);
  //check if the lesson exists in the database

  const newTeacher = await teacherDb.create({
    email,
    teacherName,
    password: harshedPassword,
  });
  newTeacher.lessons.push({ lessonName, className });
  await newTeacher.save()
  if (!newTeacher)
    return res
      .status(404)
      .json({ message: "Faced an error when creating a teacher account " });

  const teacherCount = await schoolDb.findOne({});
  teacherCount.totalTeachers += 1;

  await teacherCount.save();

  //add the teacher to the teachers table for all teachers in a schoool
  const teachers = await teachersModel.create({teacherName});
  teachers.lessons.push({ className, lessonName });
  await teachers.save();

//thereafter you have to insert the teacher into the teachers model
  await teachersModel.create({
    teacherName, lessons: [
      {
    className,lessonName
      }
      
    ]
  })
  

  return res.status(201).send(newTeacher);
} catch (error) {
  console.log(error);
  return res.status(500).json({message:"Internal server error"})
}

  
  
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

    const token = await generateAuthToken(teacherExists);
    return res
        .status(200)
        .send({ message: "logged in successfully", Token: token });
}
)



router.post("/removeTeacher",[admin,auth], async (req, res) => {
  const { teacherName} = req.body
  const teacherExists = await teachersModel.findOne({ teacherName })
  if (!teacherExists) return res.status(200).json({ message: "The teacher not found" })
  await teacherModel.findOneAndDelete({ teacherName })
  await teachersModel.findOneAndDelete({ teacherName })
  const teacherCount = await schoolDb.findOne({})
  teacherCount.totalTeachers -= 1
  await teacherCount.save()
  res.status(200).json({message:"The teacher removed successfully"})
})


router.post("/addTeachersLesson",[admin,auth], async (req, res) => {
  try {
    const { teacherName, lessonName, className } = req.body;
    const teacher = await teachersModel.findOne({ teacherName });
    if (!teacher)
      return res.status(404).send({ message: "The teacher not found" });

    teacher.lessons.push({ lessonName, className });
    await teacher.save();

    // also check if the given class exists in classes model
    const classExists = await classesModel.findOne({ className });
    if (!classExists)
      return res.status(404).json({ message: "The class does not exist" });

    const singleTeacher = await teacherDb.findOne({ teacherName });
    if (!singleTeacher)
      return res.status(404).send("The teacher does not exist");

    // Check if the lesson already exists in the lessons array
    const lessonExists = singleTeacher.lessons.find(
      (lesson) =>
        lesson.lessonName === lessonName && lesson.className === className
    );
    if (lessonExists)
      return res.status(409).json({ message: "That lesson already exists" });

    singleTeacher.lessons.push({ className, lessonName });
    await singleTeacher.save();
    return res.status(200).send(teacher);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});





module.exports = router

