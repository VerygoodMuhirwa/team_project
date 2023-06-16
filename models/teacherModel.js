const { array } = require("joi");
const mongoose = require("mongoose");
const { schema } = require("./adminModel");

const Schema = mongoose.Schema

const teacherSchema = new Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "teachersModel",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "schoolModel",
    },
    Class: {
      type: Schema.Types.ObjectId,
      ref: "classesModel",
    },
    password: {
      type: String,
      required: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "lessonsModel",
    },
    gender: {
      type: String,
      required: true,
    },

    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

const teacherModel = mongoose.model("teacherModel", teacherSchema)
module.exports= teacherModel
