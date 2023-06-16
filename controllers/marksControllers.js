const marksDb = require("../models/marksModel")
const express = require("express")
const router = express.Router()
const studentsModel= require("../models/studentsModel")
const marksModel = require("../models/marksModel")
const Joi = require("joi")
const lessonModel = require("../models/lessonModel")
const { teacherAdmin } = require("../middleware/teacherAdmin")
const { teacherAuth } = require("../middleware/teacherAuth")
const classesModel = require("../models/classesModel")

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
    try {
        const { student , Class, marks, outOf, quizDescription, comment } = req.body
        const studentExists = await studentsModel.findById(student) 
        if (!studentExists) return res.status(404).send({ message: "Student not found " }) 
        const classExists = await classesModel.findById(Class)
        if (!classExists) return res.status(404).send({ message: "The student doesn't belong to the specified class" })
        
        const newMarks = await marksModel.create({ student, Class, marks: [{ marks, outOf, quizDescription, comment, lesson: req.user.lesson }] })
    
        return res.status(201).send(newMarks)

    } catch (error) {
        return res.status(500).send({message:"Server error"})
   
}
})

router.post("/getStudentsMarksByClass", async (req, res) => {
    const { lesson } = req.body
    
})
module.exports = router


