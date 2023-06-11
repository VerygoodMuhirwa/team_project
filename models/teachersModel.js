const mongoose = require("mongoose")
const Schema = mongoose.Schema

const newTeachersSchema = new Schema({
    teacherName: {
        type: String,
        required:true
    },

    lessons: [{
        className: {
            type: String,
            required:true
        },
        lessonName: {
            type: String,
            required:true
        }
    }]

}, { timestamps: true })

const teachersModel = mongoose.model("teachersModel", newTeachersSchema);

module.exports= teachersModel