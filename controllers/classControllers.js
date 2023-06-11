const classesModel = require("../models/classesModel")
const classModel= require("../models/classModel")
const { admin } = require("../middleware/admin")
const { auth } = require("../middleware/auth")
const Joi= require("joi")
const express = require("express")
const schoolModel = require("../models/schoolModel")
const router = express.Router()


const validateClass = (item) => {
  const Schema = Joi.object({
   className:Joi.string().required()
  });
  return Schema.validate(item);
};


router.post("/addClass",  async (req, res) => {
  try {
    const { error } = validateClass(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const { className } = req.body;
    const classExists = await classesModel.findOne({ className });
    if (classExists)
      return res.status(404).json({ message: "That class already exists" });

    const newClass = await classesModel.create({ className });
    if (!newClass)
      return res
        .status(404)
        .json({ message: "Faced an error while adding a class" });

    //then let's automatically update the total classes in a achool model
    const schoolCount = await schoolModel.findOne({});
    schoolCount.totalClasses += 1;
    await schoolCount.save();

    //also let us make some changes in classmodel
    const newClassModel = await classModel.create({
      classId: newClass._id,
      className,
    });

    await newClassModel.save();

    return res.status(404).send(newClass);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



router.post("/deleteClass",[admin,auth], async (req, res) => {
    const error= validateClass(req.body)
    try {
        const { className } = req.body
        const deleteClass = await classesModel.findOneAndDelete({ className })
        if (!deleteClass) return res.status(404).json({ message: "The class not found" })
        const schoolCount = await schoolModel.findOne({})
        schoolCount.totalClasses -= 1
        await schoolCount.save()
        //also remove from teh class model
 await classModel.findOneAndDelete({ classId: deleteClass._id })
        return res.status(200).json({message:"Class deleted successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }  

})



module.exports= router 