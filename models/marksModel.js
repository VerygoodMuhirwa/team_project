const mongoose = require("mongoose")
const Schema = mongoose.Schema

const markSchema = new Schema(
  {
    marks: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "classModel",
        },
        lessonName: {
          type: String,
          required: true,
        },

        marks: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const marksModel = mongoose.model("marksModel", markSchema)

module.exports= marksModel