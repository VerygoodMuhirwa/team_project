const mongoose = require("mongoose")
const Schema = mongoose.Schema

const newTeachersSchema = new Schema({
    teacherName: {
        type: String,
        required:true
    },
    school: {
        type: Schema.Types.ObjectId,
        ref:"schoolModel"
    },
    gender: {
        type: String,
        required:true
    },
     pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  
    
        lessons: [{
            Class: {
                type: Schema.Types.ObjectId,
                ref:"classesModel"
            },
            subject: {
                type: Schema.Types.ObjectId,
                ref:"lessonsModel"
            }
    }]

}, { timestamps: true })

const teachersModel = mongoose.model("teachersModel", newTeachersSchema);

module.exports= teachersModel