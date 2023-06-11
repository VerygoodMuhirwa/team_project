const schoolDb = require("../models/schoolModel");
const Joi = require("joi");
const express = require("express");
const students= require("../models/studentsModel")
const { admin } = require("../middleware/admin")
const classModel= require("../models/classModel")
const classesModel = require("../models/classesModel")
const {auth}= require("../middleware/auth");
const studentsModel = require("../models/studentsModel");
const lessonModel = require("../models/lessonModel");
const router = express.Router();
const validateSchool = (item) => {
  const Schema = new Joi.object({
    schoolName: Joi.string().required().min(3),
    schoolMoto: Joi.string().required(),
    provinceName: Joi.string().required(),
    districtName: Joi.string().required(),
    sectorName: Joi.string().required(),
    cellName: Joi.string().required(),
    description: Joi.string().required(),
  });

  return Schema.validate(item);
};


router.post("/addSchoolDescription",[admin,auth],async (req, res) => {
  const { error } = validateSchool();
  if (error) {
    console.log(error.details[0].message);
    return res.status(404).json({ error });
  }
  const schoolInfo = await schoolDb.create(req.body);
  if (!schoolInfo) {
    return res
      .status(404)
      .json({ message: "Faced an error when creating school description " });
  } else {
    return res.status(200).json({ schoolInfo });
  }
});



router.post("/addSchoolStudents" ,async (req, res) => {
 try {
 const { studentName, className, gender } = req.body;

 const studentExists = await students.findOne({ studentName, className });
 if (studentExists)
   return res.status(409).json({ message: "That student already exists" });


   //check if the given class already exists 
   const findClass = await classesModel.findOne({ className })
   if (!findClass) return res.status(404).json({ message: "That class not found" })
   
 const newStudent = await students.create({ studentName, className, gender });
 if (!newStudent)
     return res.status(400).send("Faced an error when adding a student");
   
   const genderCount = await schoolDb.findOne({})
   
  if (gender === "female" || gender === "FEMALE" || gender === "Female") {
    genderCount.totalFemales += 1;
  } else if (gender === "male" || gender === "MALE" || gender === "Male") {
    genderCount.totalMales += 1;
    genderCount.totalPopulation =
      genderCount.totalFemales + genderCount.totalMales;
   }
   
   await genderCount.save()
   
   const classToAddStudents = await classModel.findOne({ classId: findClass._id })
   classToAddStudents.students.push({studentId:newStudent._id, studentName:newStudent.studentName, gender:newStudent.gender})
 
   await classToAddStudents.save()
   
   

   return res.status(201).send(newStudent);
 } catch (error) {
   console.log(error);
  return res.status(500).json({message:"Internal server error"})
 }
})

 




module.exports = router


