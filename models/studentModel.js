const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "studentsModel",
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "schoolModel",
    },
    Class: {
      type: Schema.Types.ObjectId,
      ref: "classesModel",
    },
    email: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      requierd: true,
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


const studentModel = mongoose.model("studentModel", studentSchema)

module.exports= studentModel