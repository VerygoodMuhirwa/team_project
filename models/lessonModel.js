const mongoose = require("mongoose")
const Schema = mongoose.Schema

const lessonSchema= new Schema({
    lessonName: {
        type: String,
        required:true
    },
    className: {
        type: String,
        required:true
    },
    teacherName: {
        type: String,
        required:true
    }
},{timestamps:true})

const lessonModel = mongoose.model("lessonModel", lessonSchema)
module.exports = lessonModel

