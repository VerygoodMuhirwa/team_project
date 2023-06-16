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
    Class: {
        type: Schema.Types.ObjectId,
        ref:"classesModel"
    },
    school: {
        type: Schema.Types.ObjectId,
        ref:"schoolModel"
    }

}, { timestamps: true })

const studentsModel = mongoose.model("studentsModel", studentsSchema)
module.exports= studentsModel