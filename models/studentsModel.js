const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studentsSchema = new Schema({
    studentName: {
        type: String,
        required:true,
    },

    gender: {
        type: String,
        required:true
    },
    className: {
        type: String,
        required:true
    }

}, { timestamps: true })

const studentsModel = mongoose.model("StudentsModel", studentsSchema)
module.exports= studentsModel