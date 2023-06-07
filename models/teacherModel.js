const { array } = require("joi");
const mongoose = require("mongoose");
const { schema } = require("./adminModel");

const Schema = mongoose.Schema

const teacherSchema = new Schema(
  {
    teacherName: {
      type: String,
      required: true,
    },
    lessons: [
      {
        lessonName: {
          type: String,
          required: true,
        },

        className: {
          type: String,
          required: true,
        },
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
