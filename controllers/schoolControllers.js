const schoolDb = require("../models/schoolModel");
const Joi = require("joi");
const express = require("express");
const { admin } = require("../middleware/admin")
const classesModel = require("../models/classesModel")
const {auth}= require("../middleware/auth");
const studentsModel = require("../models/studentsModel");
const schoolModel = require("../models/schoolModel");
const teachersModel = require("../models/teachersModel");
const lessonModel = require("../models/lessonModel");
const classModel = require("../models/classModel");
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
    villageName: Joi.string().required(),
        pic: Joi.string().required(),

  });

  return Schema.validate(item);
};


router.post("/schoolDescription",[admin,auth],async (req, res) => {
  const { error } = validateSchool();
  if (error) {
    console.log(error.details[0].message);
    return res.status(404).json({ error });
  }

  const {schoolName, schoolMoto, provinceName, districtName, sectorName,pic, cellName, villageName} =req.body

  const schoolExists = await schoolDb.findOne({ schoolName, schoolMoto, sectorName, provinceName,  districtName, cellName,villageName })  
if(schoolExists)return res.status(409).send({message:"The school already exists"})
  console.log(schoolExists);
if(schoolExists)return res.status(409).send({message:"That school already exists"})
  const schoolInfo = await schoolDb.create(req.body );
  if (!schoolInfo) {
    return res
      .status(404)
      .json({ message: "Faced an error when creating school description " });
  } else {
    return res.status(200).json({ schoolInfo });
  }
});

router.post("/removeSchoolDescriptions", [admin, auth], async (req, res) => {
 try {
   const { schoolId } = req.body
   const findSchool = await schoolModel.findById({ _id: schoolId })
   if (!findSchool) return res.status(404).send({ message: "School not found" })
   await schoolModel.findByIdAndDelete({_id:schoolId})
   return res.status(200).send({message:"School removed successfully"})
 } catch (error) {
   return res.status(500).json({message:"Server error"})
  }
  
});






router.post("/addSchoolStudents", [admin,auth],async (req, res) => {
  try {
    let { studentName, gender, Class, school } = req.body;
gender= gender.toLowerCase()
    if (!Class || !school) {
      return res
        .status(400)
        .send({ message: "Invalid request. Missing Class or school." });
    }


    const classExists = await classesModel.findById(Class);

    const studentExists = await studentsModel.findOne({ Class, studentName, school, gender })
    if(studentExists)return res.status(409).send({message:"That student already exists in that class"})

    if (!classExists) {
      return res.status(400).send({ message: "Class does not exist." });
    }

    const schoolCount = await schoolModel.findOne({ _id: school });

    if (!schoolCount) {
      return res.status(400).send({ message: "School does not exist." });
    }

    if (gender.toLowerCase() === "male") {
      schoolCount.totalMales += 1;
    } else if (gender.toLowerCase() === "female") {
      schoolCount.totalFemales += 1;
    }
    
    await schoolCount.save()

    const newStudent = await studentsModel.create({
      studentName,
      gender,
      Class,
      school,
    });

    const addStudentInClass = await classModel.findOne({ classId: Class })
    addStudentInClass.students.push({ studentId: newStudent._id })
    await addStudentInClass.save()
    
    const newLearner = await studentsModel.find({_id: newStudent._id}).populate("school").populate("Class")
    return res.status(200).send(newLearner);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error" });
  }
});


router.post("/removeSchoolStudent", [admin, auth], async (req, res) => {
  console.log(req.body);
  try {
    let {student, Class,   gender,school} = req.body
    gender = gender.toLowerCase()
    const classExists = await classesModel.findOne({ _id: Class, school });
    if (!classExists) {
      return res.status(400).send({ message: "Class does not exist" });
    }

    const studentExists = await studentsModel.findOne({
      _id: student,
      gender,
      Class,
      school,
    });
    if (!studentExists) {
      return res.status(404).send({ message: "Student does not exist" });
    }

    const schoolCount = await schoolModel.findOne({ _id: school });
    if (gender === "male") {
      schoolCount.totalMales -= 1;
    } else if (gender === "female") {
      schoolCount.totalFemales -= 1;
    }
    await schoolCount.save();

    await studentsModel.findByIdAndDelete(student);

    return res.status(200).send({ message: "Student removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error" });
  }
});


router.post("/addSchoolTeacher", async (req, res) => {
  try {
    let { teacherName, school, gender, Class, subject } = req.body;
    gender = gender.toLowerCase();
    const teacherExists = await teachersModel.findOne({
      teacherName,
      school
    });
    if (teacherExists)
      return res.status(409).send({ message: "The teacher already exists" });

    const lessonExists = await lessonModel.findById(subject);
    if (!lessonExists)return res.status(404).send({ message: "Invalid lesson or class" });
   
   const classExists= await classesModel.findById(Class)
if(!classExists)return res.status(404).send({message:"Class not found"})
   
   
    const newTeacher = await teachersModel.create({
      teacherName,
      school,
      lessons: [
        {
          Class,
          subject,
        },
      ],
      gender,
    });

    const teacher = await teachersModel.find({ _id: newTeacher._id })
      .populate("school")
      .populate("lessons.Class").populate("lessons.subject");
    return res.status(201).send(teacher);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error" });
  }
});


router.delete("/removeSchoolTeacher/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;
    console.log(teacherId);
    const removedTeacher = await teachersModel.findByIdAndRemove(teacherId);

    if (!removedTeacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    return res.status(200).send({ message: "Teacher removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error" });
  }
});



module.exports = router



