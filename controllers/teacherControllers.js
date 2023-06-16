const bcrypt = require("bcrypt");
const Joi = require("joi");
const schoolDb= require("../models/schoolModel")
const teacherDb = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
const express = require("express");
const lessonModel = require("../models/lessonModel");
const { teacherAdmin } = require("../middleware/teacherAdmin");
const { teacherAuth } = require("../middleware/teacherAuth");
const teachersModel = require("../models/teachersModel");
const { admin } = require("../middleware/admin")
const {auth}= require("../middleware/auth")
const classesModel = require("../models/classesModel");
const teacherModel = require("../models/teacherModel");
const schoolModel = require("../models/schoolModel");
const router = express.Router();
const validateTeacher = (item) => {
  const Schema = new Joi.object({
    teacher: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
    lesson: Joi.string().required(),
    Class: Joi.string().required(),
    gender: Joi.string().required(),
    school: Joi.string().required(),
  });

  return Schema.validate(item);
};






//This is the function to generate the token for the teacher 
const generateAuthToken = (id, lesson) => {
  const token = jwt.sign({ id,role:"teacher" , lesson}, process.env.TEACHERPRIVATEKEY, {
    expiresIn: "1d",
  });
  return token;
};

router.post("/registerTeacher",async (req, res) => {
  const { error } = validateTeacher(req.body);
  if (error) return res.status(404).json({ error: error.details[0].message });

try {
  const { teacher, email, password, lesson,  school, Class } = req.body;
let {pic} = req.body
  let gender = req.body.gender.toLowerCase()

  const schoolTeacher = await teachersModel.findById(teacher)
  if (!schoolTeacher) return res.status(404).send({ message: "Teacher not found " })

  const teacherExists = await teacherModel.findOne({ email });
  if (teacherExists) {
    return res.status(409).send("The teacher with that email already exists");
  }

  const lessonExists = await lessonModel.findById({_id: lesson , Class, school});
  if (!lessonExists)
    return res.status(404).json({ message: "The lesson not found " });
  
  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);
  
  //check if the lesson exists in the database

  const newTeacher = await teacherModel.create({
    email,
    teacher,
    gender,
    password: harshedPassword,
    pic,
    lesson
  });

    const teacherCount = await schoolModel.findOne({});
    teacherCount.totalTeachers += 1;
  await teacherCount.save();
  const teacherToReturn = await teacherModel.find({_id: newTeacher._id}).populate("lesson")
   return res.status(201).send(teacherToReturn);
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

    const token = await generateAuthToken(teacherExists._id, teacherExists.lesson);
    return res
        .status(200)
        .send({ message: "logged in successfully", Token: token });
}
)



router.post("/removeTeacher",[admin,auth], async (req, res) => {
  const { teacher} = req.body
  const teacherExists = await teachersModel.findById(teacher)
  if (!teacherExists) return res.status(200).json({ message: "The teacher not found" })
  await teacherModel.findByIdAndDelete(teacher)
  await teachersModel.findOneAndDelete({ teacherName})
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


router.get(
  "/getAllStudentsByClass/:classId",
  [teacherAdmin, teacherAuth],

  async (req, res) => {
    const classId = req.params.classId;
    //check the class by its name
    const getClass = await classesModel.findById(classId);
    if (!getClass) return res.status(404).json({ message: "Class not found" });

    //get all members of the class
    const findingClass = await classModel
      .findOne({ classId })
      .populate("students.studentId");
    const allStudents = findingClass.students;
    return res.status(200).json({ students: allStudents });
  }
);


router.get(
  "/getAllStudentsByClass/:classId",
  [teacherAdmin, teacherAuth],

  async (req, res) => {
    const classId = req.params.classId;
    //check the class by its name
    const getClass = await classesModel.findById(classId);
    if (!getClass) return res.status(404).json({ message: "Class not found" });

    //get all members of the class
    const findingClass = await classModel
      .findOne({ classId })
      .populate("students.studentId");
    const allStudents = findingClass.students;
    return res.status(200).json({ students: allStudents });
  }
);


module.exports = router

