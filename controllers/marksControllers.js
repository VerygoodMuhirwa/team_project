const marksDb = require("../models/marks")
const express = require("express")
const router = express.Router()


router.post("/addMarks", async (req, res) => {
try {
    
} catch (error) {
    return res.status(500).json({message:"Internal server error"})
}
})