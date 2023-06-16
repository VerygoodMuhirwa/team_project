const bcrypt = require("bcrypt");
const Joi = require("joi");
const studentDb = require("../models/studentModel");
const express = require("express")
const router = express.Router()
const jwt= require("jsonwebtoken")
const {teacherAdmin} = require("../middleware/teacherAdmin")
const {studentAuth}= require("../middleware/studentAuth")
const {studentAdmin} = require("../middleware/studentAdmin");
const studentsModel = require("../models/studentsModel");
const studentModel = require("../models/studentModel");
const validateStudent = (item) => {
  const Schema = new Joi.object({
    student: Joi.string().min(3).required(),
    gender: Joi.string().min(4).required(),
    pic: Joi.string().required(),
    Class: Joi.string().required(),
    school: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(6).required(),
  });
return Schema.validate(item)
};


const generateAuthToken = (item) => {
  const token = jwt.sign({ id: this._id, role:"student", className:this.className ,studentName:this.studentName}, process.env.JWTSTUDENTKEY, {
    expiresIn: "1d",
  });
  return token;
};


router.post("/registerStudent", async (req, res) => {
  const { error } = validateStudent(req.body)
  if(error)return res.status(400).send(error.details[0].message)
  try {
    let { student, school, Class,pic, email, password, gender } = req.body
    gender = gender.toLowerCase()
    const studentExistInSchoool = await studentsModel.findOne({_id: student, gender, Class, school })
    if (!studentExistInSchoool)return res.status(409).send({ message: "Not allowed to create account  " })
    const studentExists = await studentModel.findOne({ email })
    if (studentExists) return res.status(409).send({ message: "The student already exists " })
    const salt = await bcrypt.genSalt(10)
    const harshedPassword = await bcrypt.hash(password, salt)
   let  newStudent = await studentModel.create({ student,password:harshedPassword, email, gender,pic, Class, school })
   const newLearner  = await studentModel.find({_id:newStudent._id}).populate("Class").populate("school").populate("student")
    return res.status(201).send(newLearner)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server errror" })
    
  }
}
)



router.post("/loginStudent",async (req, res) => {
 try {
   const { email, password } = req.body;
   const student = await studentModel.findOne({ email });
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
 } catch (error) {
  return res.status(500).json({message:"Server error"})
 }
})


router.get("/searchLesson", [studentAdmin, studentAuth], async (req, res) => {

})


router.get(
  "/getStudentMarks",
  [studentAdmin, studentAuth],
  async (req, res) => {
    const studentName = req.user.studentName;
    const studentMarks = await marksModel.findOne({ studentName });
    if (!studentMarks)
      return res.status(404).json({ message: "no marks inserted yet" });
    await res.status(200).send(studentMarks);
  }
);





module.exports = router


