const mongoose = require("mongoose")
const Schema = mongoose.Schema

const lessonSchema = new Schema(
  {
    lessonName: {
      type: String,
      required: true,
    },
    Class: {
      type: Schema.Types.ObjectId,
      ref: "classesModel",
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "schoolModel",
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "teachersModel",
    },
  },
  { timestamps: true }
);

const lessonModel = mongoose.model("lessonsModel", lessonSchema)
module.exports = lessonModel



