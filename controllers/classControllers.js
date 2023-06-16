const classesModel = require("../models/classesModel")
const { admin } = require("../middleware/admin")
const { auth } = require("../middleware/auth")
const Joi= require("joi")
const express = require("express")
const schoolModel = require("../models/schoolModel")
const classModel = require("../models/classModel")
const router = express.Router()


const validateClass = (item) => {
  const Schema = Joi.object({
    className: Joi.string().required(),
    school:Joi.string().required()
  });
  return Schema.validate(item);
};


router.post("/addClass",[admin, auth],  async (req, res) => {
  try {
    const { error } = validateClass(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const { className , school} = req.body;
    const classExists = await classesModel.findOne({ className,school });
    if (classExists)return res.status(404).json({ message: "That class already exists" });

    const schoolCount = await schoolModel.findOne({});
    schoolCount.totalClasses += 1;

    const newClass = await classesModel.create({ className ,school});
    if (!newClass)
      return res
        .status(404)
        .json({ message: "Faced an error while adding a class" });

    await schoolCount.save();
    await classModel.create({ classId: newClass._id })
    const classToReturn = await classesModel.find({_id:newClass._id}).populate("school")

  return res.status(404).send(classToReturn);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




router.post("/deleteClass",[admin,auth], async (req, res) => {
    try {
      const { classId } = req.body
      const classExists = await classesModel.findById({ _id:classId })
      if (!classExists) return res.status(404).send({ message: "Class not found " }) 
      const schoolCount = await schoolModel.findOne({});
      schoolCount.totalClasses -= 1;
      await schoolCount.save();
      await classesModel.findOneAndDelete({ _id: classId});
  
      return res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }  

})



module.exports= router 