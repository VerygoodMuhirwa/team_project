const mongoose = require("mongoose")
const Schema = mongoose.Schema

const markSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "studentsModel",
    },
    studentName: {
    type:String,
    required:true
  },
    className: {
      type: String,
      required: true,
    },
    marks: [
      {
        lessonName: {
          type: String,
          required: true,
        },
 
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
          required:true
        },
        comment: {
          type: String,
          required:true
        }
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