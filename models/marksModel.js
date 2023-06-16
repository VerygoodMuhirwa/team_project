const mongoose = require("mongoose")
const Schema = mongoose.Schema

const markSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "studentsModel",
    },
    Class: {
      type: Schema.Types.ObjectId,
      ref: "classesMddel",
    },
    marks: [
      {
        marks: {
          type: Number,
          required: true,
        },
        outOf: {
          type: Number,
          required: true,
        },
        quizDescription: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        lesson: {
          type: Schema.Types.ObjectId,
          ref: "lessonsModel",
        },
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
      default: 0,
    },
    totalOutOfMarks: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const marksModel = mongoose.model("marksModel", markSchema)

module.exports= marksModel