
const { admin } = require("../middleware/admin")
const {auth}= require("../middleware/auth")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Joi = require("joi");
const express = require("express");
const adminModel = require("../models/adminModel");
const lessonModel = require("../models/lessonModel");
const marksModel = require("../models/marksModel");
const classesModel = require("../models/classesModel");
const router= express.Router()
require("dotenv").config()

const generateAuthToken = (id) => {
  const token = jwt.sign({ id: id, isAdmin: true }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};


//my twilio credentials
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);

//validating the user
const validateUser = (item) => {
  const Schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    phoneNumber: Joi.string().required().min(10),
    password: Joi.string().min(6).required().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
  .message(' the password must contain at least one alphabet, one digit, and one special character from the set !@#$%^&*. It should also be at least 6 characters long. If the password doesn')
  });
  return Schema.validate(item);
};

//function to send confirmation codes

const generateConfirmationCode = async () => {
  return Math.floor(1000 + Math.random() * 9000);
};


router.post("/createUser", async (req, res) => {
  try {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(404).send({ error: error.details[0].message });
  }

  const { email, password, phoneNumber } = req.body;
  //check if the user with that email exists in the database
  let user = await adminModel.findOne({ email });
  if (user) {
    return res.status(409).send("The user with that email already exists");
    }
  //send a confirmation code
  const confirmationCode = await generateConfirmationCode();
  const message = await client.messages.create({
    from: process.env.twilioPhoneNumber,
    to: phoneNumber,
    body: `Your confirmation code is ${confirmationCode}`,
  });
        console.log("Reached here");


  if (!message) {
    return res.status(400).send("Failed to send a confirmation code");
  }

  console.log("Confirmation code sent successfully");

  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);
  user = await adminModel.create({ email, password: harshedPassword, phoneNumber });

  if (user) {
    return res.status(200).send(user);
  }
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }
}
)


router.post("/loginUser",async (req, res) => {
  const { email, password } = req.body;
  const user = await adminModel.findOne({ email });
  if (!user) {
    return res.status(404).send("Invalid email or password");
  }

  //harsh the request body password
  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);

  if (!user.password == harshedPassword) {
    return res.status(404).send("Invalid email or password");
  }

  //generate the token for the user

  const token = await generateAuthToken(user._id);
  return res
    .status(200)
    .send({ message: "logged in successfully", Token: token });
}
)


router.post("/inviteTeacher",[admin, auth], async (req, res) => {
  const { email } = req.body;
});


router.get("/getAllTeachers", [admin, auth], async (req, res) => {
  const allTeachers = await teachersModel.find().sort({ teacherName: 1 });
  res.status(200).send(allTeachers);
});

router.get("/getAllStudents",[admin,auth], async (req, res) => {
  try {
    const allStudents = await students.find().sort({ studentName: 1 });
    if (!allStudents)
      return res.status(404).json({ message: "No students found " });
    return res.status(200).send(allStudents);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/removeStudent",[admin,auth], async (req, res) => {
  const { studentName, className } = req.body;
  try {
    //check whether the student exists
    const studentExist = await studentsModel.findOne({
      studentName,
      className,
    });

    if (!studentExist)
      return res.status(404).json({ Message: "That student does not exists" });

    //check the student in the school db
    const genderCount = await schoolDb.findOne({});
    if (
      studentExist.gender === "female" ||
      studentExist.gender === "FEMALE" ||
      studentExist.gender === "Female"
    ) {
      genderCount.totalFemales -= 1;
    } else if (
      studentExist.gender === "male" ||
      studentExist.gender === "MALE" ||
      studentExist.gender === "Male"
    ) {
      genderCount.totalMales -= 1;
      genderCount.totalPopulation =
        genderCount.totalFemales + genderCount.totalMales;
    }
    await genderCount.save();

    //do this to remove the student from the class
    const deleteStudentFromClass = await classModel.findOne({ className });
    console.log(deleteStudentFromClass);
    deleteStudentFromClass.students = deleteStudentFromClass.students.filter(
      (student) => student.studentId.toString() !== studentExist._id.toString()
    );
    await deleteStudentFromClass.save();
    console.log(deleteStudentFromClass);
    await studentsModel.deleteOne({ _id: studentExist._id });

    return res
      .status(200)
      .json({ Message: "The student removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ Message: "Internal server error" });
  }
});

router.post(
  "/getAllStudentsByClass",[admin, auth] ,

  async (req, res) => {
    const { className } = req.body;
    //check the class by its name
    const getClass = await classesModel.findOne({ className });
    if (!getClass) return res.status(404).json({ message: "Class not found" });

    //get all members of the class
    const classExists = await classModel.findOne({ classId: getClass._id });
    const allStudents = classExists.students;

    return res.status(200).json({ students: allStudents });
  }
);


router.get("/getTopFiveStudentsInSchool", async (req, res) => {
 
  try {
      const topFive = await marksModel.find().sort({ percentage: -1 });
return res.status(200).send(topFive)
  } catch (error) {
   return res.status(500).json({message:"Internal server error"}) 
  }
  


})



router.post("/getMarksByClassName", async (req, res) => {
  const { className } = req.body;
  const classExists = await classesModel.findOne({ className });
  if (!classExists)
    return res.status(404).json({ message: "Class not found " });

  const allMarks = await marksModel.findOne({ className });
  if (allMarks == null)
    return res.status(404).json({ message: "No marks inserted yet" });
  return res.status(200).send(allMarks);
});

router.get("/getAllClasses", async (req, res) => {
  const classes = await classesModel.find().sort({ className: 1 });
  if (!classes) return res.status(404).json({ message: "No any class found " });
  res.send(classes);
});




module.exports= router