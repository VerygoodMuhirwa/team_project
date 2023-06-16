
const express = require("express")
const lessonModel = require("../models/lessonModel")
const router = express.Router()
const Joi= require("joi");
const teachersModel = require("../models/teachersModel");
const { auth } = require("../middleware/auth");
const {admin} = require("../middleware/admin")
const validateLesson = (item) => {
  const Schema = new Joi.object({
    lessonName: Joi.string().required(),
    Class: Joi.string().required(),
    school: Joi.string().required(),
  });

  return Schema.validate(item);
};
router.post("/addLesson", [admin, auth] ,async (req, res) => {
    const { error } = validateLesson(req.body)
    if(error)return res.status(400).send(error.details[0].message)
    try {

        const { lessonName, Class, school } = req.body;
        const lessonExists = await lessonModel.findOne({ lessonName, Class,school });
       
         if (lessonExists)return res
             .status(400)
             .json({ message: "The lesson already exists" });

      const newLesson = await lessonModel.create({ lessonName, Class, school });
      const lesson = await lessonModel.find({_id:newLesson._id}).populate("Class").populate("school")
     return res.status(200).send(lesson);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error"})
    }
   
})



router.post("/removeLesson", [admin, auth], async (req, res) => {
    
     try {
       const { lesson , Class, school } = req.body;
       const lessonExists = await lessonModel.findOne({
         _id:lesson,
         Class,
         school,
       });

       if (!lessonExists)
         return res.status(400).json({ message: "Lesson not found" });

     await lessonModel.findByIdAndDelete({_id: lesson})
       return res.status(200).send({message:"Lesson removed successfully"});
     } catch (error) {
       console.log(error);
       return res.status(500).json({ message: "Server error" });
     }
   
})
module.exports = router


    