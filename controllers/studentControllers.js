const bcrypt = require("bcrypt");
const Joi = require("joi");
const studentDb = require("../models/studentModel");
const express = require("express")
const router = express.Router()
const students = require("../models/studentsModel")
const { admin } = require("../middleware/admin")
const { auth } = require("../middleware/auth")
const { teacherAuth } = require("../middleware/teacherAuth")
const {teacherAdmin}= require("../middleware/teacherAdmin")
const jwt= require("jsonwebtoken")
const marksModel= require("../models/marksModel");
const studentsModel = require("../models/studentsModel");
const classesModel = require("../models/classesModel");

const {studentAuth}= require("../middleware/studentAuth")
const {studentAdmin} = require("../middleware/studentAdmin")
const classModel = require("../models/classModel");
const schoolDb= require("../models/schoolModel")
const validateStudent = (item) => {
  const Schema = new Joi.object({
    studentName: Joi.string().min(3).required(),
    className: Joi.string().min(3).required(),
    gender: Joi.string().min(4).required(),
    
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string()
      .min(6)
      .required() });

  return Schema.validate(item);
};


const generateAuthToken = (item) => {
  const token = jwt.sign({ id: this._id, role:"student", className:this.className ,studentName:this.studentName}, process.env.JWTSTUDENTKEY, {
    expiresIn: "1d",
  });
  return token;
};


router.post("/registerStudent",async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(404).send({ "Error": error.details[0].message });

  try {
    const { studentName,gender, pic,  className, email, password } = req.body;

    const studentExistsInSchool = await students
      .findOne({ studentName, className, gender })
      .exec();
    if (!studentExistsInSchool)
      return res
        .status(404)
        .json({ message: "Not allowed to create the account " });

    
    
    const studentExists = await studentDb.findOne({ email });
    if (studentExists) {
      return res.status(409).send("The student with that email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const harshedPassword = await bcrypt.hash(password, salt);


    //insert the schoolid for the student 
    const studentSchoolId= studentExistsInSchool._id
    const newStudent = await studentDb.create({
      email,
      password: harshedPassword,
      className,
      pic,
  studentSchoolId:studentSchoolId,
      studentName,
    });


    if (!newStudent)
      return res
        .status(404)
        .json({ message: "Faced an error when creating a user " });
    
  
    
    return res.status(201).send(newStudent);
  } catch (error) {
    return res.status(500).json({message:"Internal server errror"})
  }
}
)



router.post("/loginStudent",async (req, res) => {
  const { email, password } = req.body;
  const student = await studentDb.findOne({ email });
  if (!student) {
    return res.status(404).send("Invalid email or password");
  }

  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);

  if (!student.password == harshedPassword) {
    return res.status(404).send("Invalid email or password");
  }

  const token = await generateAuthToken(student);
  return res
    .status(200)
    .send({ message: "logged in successfully", Token: token });
})


router.get("/searchLesson",[admin,auth], async (req, res) => {
  const lessonName = req.query.search;

  try {
    const lesson = await marksModel.findOne({
      "marks.lessonName": { $regex: lessonName, $options: "i" },
      "marks.studentId": req.user.id,
    });

    if (!lesson) {
      return res
        .status(404)
        .json({ message: "Lesson not found for the student." });
    }


    const marks = lesson.marks.find((mark) => mark.lessonName === lessonName);

    res.send(marks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});



router.post(
  "/getAllStudentsByClass",[teacherAdmin,teacherAuth],
 
  async (req, res) => {
    const { className } = req.body
    //check the class by its name
    const getClass= await classesModel.findOne({className})
    if (!getClass) return res.status(404).json({ message: "Class not found" })
    
   //get all members of the class 
    const classExists = await classModel.findOne({ classId: getClass._id })
    const allStudents = classExists.students
    

    return res.status(200).json({students:allStudents})
  }

);


router.get("/getStudentMarks",[studentAdmin, studentAuth], async (req, res) => {
  const studentName = req.user.studentName
  const studentMarks = await marksModel.findOne({ studentName })
  if(!studentMarks)return res.status(404).json({message:"no marks inserted yet"})
await res.status(200).send(studentMarks)
})






module.exports = router


