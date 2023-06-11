
const express = require("express")
const lessonModel = require("../models/lessonModel")
const router = express.Router()
const Joi= require("joi");
const teachersModel = require("../models/teachersModel");

const validateLesson = (item) => {
  const Schema = new Joi.object({
   lessonName:Joi.string().required(),
      className:Joi.string().required()

  });

  return Schema.validate(item);
};
router.post("/addLesson", async (req, res) => {
    const { error } = validateLesson(req.body)
    if(error)return res.status(400).send(error)
    try {

        const { lessonName, className, teacherName } = req.body;
        //check if the teacher exists 
        const teacherExists = await teachersModel.findOne({ teacherName })
        if(!teacherExists)return res.status(404).json({message:"That teacher not found "})

         // chekckk if the lesson exists
        
        
        const lessonExists = await lessonModel.findOne({ lessonName, className, teacherName });
       
         if (lessonExists)return res
             .status(400)
             .json({ message: "The lesson already exists" });

        const newLesson = await lessonModel.create({ lessonName });
     return     res.status(200).send(newLesson);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
   
})

module.exports = router

