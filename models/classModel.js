const mongoose = require("mongoose")
const Schema = mongoose.Schema

const classSchema = new Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref:"classesModel"
   },
    students: [
        {
            studentId: {
                type: Schema.Types.ObjectId,
                ref:"studentsModel"
            }
        }
    ]
}, { timestamps: true })

const classModel = mongoose.model("classModel", classSchema)
module.exports= classModel


