const marksDb = require("../models/marksModel")
const express = require("express")
const router = express.Router()
const studentsModel= require("../models/studentsModel")
const marksModel = require("../models/marksModel")
const Joi = require("joi")
const lessonModel = require("../models/lessonModel")
const { teacherAdmin } = require("../middleware/teacherAdmin")
const { teacherAuth } = require("../middleware/teacherAuth")

const validateMarks = (item) => {
    const Schema = new Joi.object({
      lessonName: Joi.string().required(),
      studentName: Joi.string().required(),
      className: Joi.string().required(),
      outOf: Joi.number().required(),
      marks: Joi.number().required(),
      quizDescription: Joi.string().required(),
      comment: Joi.string().required(),
    });
    return Schema.validate(item)
}

router.post("/addMarks",[teacherAdmin,teacherAuth], async (req, res) => {
    const { error } = validateMarks(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    try {
    
        const lessonName= req.user.lessonName
    const {  studentName, className, quizDescription, comment, outOf, marks } = req.body
    console.log(req.body);
//find if the student by his class name and his or her name 
    const student = await studentsModel.findOne({ studentName, className })
    if (!student) return res.status(404).json({ message: "Student not found" })
    await marksModel.create({studentId:student._id,studentName, className})
    const lessonExists = await lessonModel.findOne({ lessonName })
    if (!lessonExists) return res.status(404).json({ message: "Lesson not found " })
        
    const newMarks = await marksModel.findOne({});

    newMarks.marks.push({ marks,lessonName,outOf,  quizDescription,comment })
    newMarks.totalMarks += marks
    
    newMarks.totalOutOfMarks += outOf
    newMarks.percentage = (newMarks.totalMarks / newMarks.totalOutOfMarks) * 100;
    await newMarks.save();
    console.log(newMarks);
    res.status(200).send(newMarks)
} catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
}
})

router.post("/getStudentsMarksByClass", async (req, res) => {
    const { lesson } = req.body
    
})
module.exports = router


