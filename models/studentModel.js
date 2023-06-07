const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studentSchema = new Schema(
  {
    studentName: {
      type: String,
      required:true
    },
    
    studentSchoolId: {
            type: Schema.Types.ObjectId,
ref:"studentsModel",
    },

 email: {
      type: String,
    },

    password: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required:true
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


const studentModel = mongoose.model("StudentModel", studentSchema)

module.exports= studentModel