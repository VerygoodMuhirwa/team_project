const mongoose = require("mongoose")

const Schema = mongoose.Schema

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,

    },
  
  isAdmin: {
    type: Boolean,
    default: true,
  },
   pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
}, { timestamps: true });


const adminModel = mongoose.model("adminModel", adminSchema)
module.exports = adminModel
