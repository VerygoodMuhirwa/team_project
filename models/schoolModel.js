const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schoolSchema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },
    provinceName: {
      type: String,
    },
    districtName: {
      type: String,
    },
    sectorName: {
      type: String,
      required: true,
    },
    cellName: {
      type: String,
      required: true,
    },
    villageName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    schoolMoto: {
      type: String,
      required: true,
    },
    totalPopulation: {
      type: Number,
    },

    totalFemales: {
      type: Number,
      required: true,
      default: 0,
    },

    totalMales: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTeachers: {
      type: Number,
      required: true,
      default:0
    },
    totalClasses: {
      type: Number,
      default: 0,

      required:true
    }

  },{ timestamps: true });

const schoolModel = mongoose.model("schoolModel", schoolSchema)

module.exports= schoolModel