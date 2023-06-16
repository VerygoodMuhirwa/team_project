
const { admin } = require("../middleware/admin")
const {auth}= require("../middleware/auth")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const Joi = require("joi");
const express = require("express");
const adminModel = require("../models/adminModel");
const marksModel = require("../models/marksModel");
const classesModel = require("../models/classesModel");
const teachersModel = require("../models/teachersModel");
const studentModel = require("../models/studentModel");
const classModel = require("../models/classModel");
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
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phoneNumber: Joi.string().required().min(10),
    pic: Joi.string().required(),

    password: Joi.string().min(6).required(),
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
  // // send a confirmation code
  // const confirmationCode = await generateConfirmationCode();
  // const message = await client.messages.create({
  //   from: process.env.twilioPhoneNumber,
  //   to: phoneNumber,
  //   body: `Your confirmation code is ${confirmationCode}`,
  // });
  //       console.log("Reached here");


  // if (!message) {
  //   return res.status(400).send("Failed to send a confirmation code");
  // }

  // console.log("Confirmation code sent successfully");

  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);
  user = await adminModel.create({ email, password: harshedPassword, phoneNumber, pic });

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
  const transporter = await nodemailer.createTransport({
    service:process.env.SERVICE,
    auth: {
      user: process.env.user,
      pass:process.env.pass
    }
  })
const link = "http://localhost:3000/frontendPage";

const mailOptions = {
  from: process.env.email,
  to: email,
  subject: "Register as a teacher ",
  html: `Click <a src="${link}">here to go to register as a teacher </a>`,
};

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
return res.status(400).send({message:"Failed to send an email "})
    } else {
      console.log("Email sent", info.response);
      return res.status(200).send({message:"Email sent successfully"})
  }
});

  
});


router.get("/getAllTeachers", [admin, auth], async (req, res) => {
  const allTeachers = await teachersModel.find().sort()
if(allTeachers.length ==0)return res.status(404).send({message:"Teachers not found "})
  res.status(200).send(allTeachers);
});

router.get("/getAllStudents",[admin,auth], async (req, res) => {
  try {
    const allStudents = await studentModel.find().sort({ studentName: 1 });
if(allStudents.length ==0)return res.status(404).send({message:"No"}) 
    return res.status(200).send(allStudents);
  } catch (error) {
    console.log(error);
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
    if (studentExist.gender.toLowerCast() === "female"  ) {
      genderCount.totalFemales -= 1;
    } else if (studentExist.gender.toLowerCase() === "male" ) {
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

router.get("/getTopFiveStudentsInSchool",[admin, auth], async (req, res) => {
 
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

router.get("/getAllClasses/:schoolId", async (req, res) => {
  const schoolId = req.params.schoolId

  const classes = await classesModel.find({school: schoolId}).sort({ className: 1 });
  if (!classes) return res.status(404).json({ message: "No any class found " });
  res.send(classes);
});


router.get("/getAllStudentsByClass/:classId",[admin, auth],async (req, res) => {
const classId= req.params.classId
    const getClass = await classesModel.findById(classId)
    if (!getClass) return res.status(404).json({ message: "Class not found" });
    const findingClass = await classModel.findOne({ classId }).populate("students.studentId")
    const allStudents= findingClass.students
    return res.status(200).json({ students: allStudents });
  }
);




module.exports= router