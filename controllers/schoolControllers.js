const schoolDb = require("../models/schoolModel");
const Joi = require("joi");
const express = require("express");
const students= require("../models/studentsModel")
const { admin } = require("../middleware/admin")
const classModel= require("../models/classModel")
const classesModel = require("../models/classesModel")
const {auth}= require("../middleware/auth");
const studentsModel = require("../models/studentsModel");
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



router.post("/addSchoolStudents",[admin,auth] ,async (req, res) => {
 try {
 const { studentName, className, gender } = req.body;

 const studentExists = await students.findOne({ studentName, className });
 if (studentExists)
   return res.status(409).json({ message: "That student already exists" });

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
   


   //also update the class model when a new student is inserted into the system
   const findClass = await classesModel.findOne({ className })
   const settingClassModel = await classModel.findOne({})
   settingClassModel.classId = findClass._id
   settingClassModel.className = findClass.className,
     settingClassModel.students.push({studentId:newStudent._id})
  await settingClassModel.save()
return res.status(201).send(newStudent);
 } catch (error) {
  return res.status(500).json({message:"Internal server error"})
 }
})

 

router.get("/getAllStudents",async (req, res) => {
try {
  const allStudents = await students.find();
  console.log(allStudents);
  if (!allStudents)return res.status(404).json({ message: "No students found " });
    return res.status(allStudents);
} catch (error) {
  return res.status(500).json({message:"Internal server error"})
}
})

router.get("/getAllClasses",  async (req, res) => {
  const classes = await classesModel.find().sort({ className: -1 })
  console.log(classes);
  if(!classes)return res.status(404).json({message:"No any class found "})
  res.send(classes)
})

router.post("/getAllStudentsByClass/:id", [admin, auth], async (req, res) => {
  
} )


router.get("/removeStudent", async (req, res) => {
  const { studentName,className } = req.body
  try {
    //check whether the student exists 
    const studentExist = await studentsModel.findOneAndDelete({ studentName,className })
    if (!studentExist) return res.status(404).json({ Message: "That student does not exists" })

    //check the student in the school db 
    const genderCount = await schoolDb.findOne({});

    if (studentExist.gender === "female" || studentExist.gender === "FEMALE" || studentExist.gender === "Female") {
      genderCount.totalFemales -= 1;
    } else if (studentExist.gender === "male" || studentExist.gender === "MALE" || studentExist.gender === "Male") {
      genderCount.totalMales -= 1;
      genderCount.totalPopulation =
        genderCount.totalFemales + genderCount.totalMales;
    }
    await genderCount.save();
   
//do this to remove the student from the class
    const deleteStudentFromClass = await classModel.findOne({})
    deleteStudentFromClass.students.filter((student) => student.studentId !== studentExist._id)
    await deleteStudentFromClass.save();
    await studentExist.save()
    
    return res.status(200).json({Message:"The student removed successfully"})
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({"Message":"Internal server error"})
  }
})

module.exports = router


