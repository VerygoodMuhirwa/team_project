const mongoose = require("mongoose")
const Schema = mongoose.Schema

const classesSchema = new Schema({
    school: {
        type: Schema.Types.ObjectId,
        ref:"schoolModel"
    },
    className: {
        type: String,
        required:true
    }
}, { timestamps: true })


const classesModel = mongoose.model("classesModel", classesSchema)
module.exports= classesModel