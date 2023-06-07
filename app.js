const express = require("express")
const app = express()
app.use(express.json());
require("dotenv").config();

const schoolControllers = require("./controllers/schoolControllers")
const teacherControllers = require("./controllers/teacherControllers")
const studentControllers = require("./controllers/studentControllers")
const classControllers= require("./controllers/classControllers")
const adminControllers  = require("./controllers/adminControllers")
const mongooose = require("mongoose")
mongooose.connect(process.env.mongodbUrl)
    .then(() => console.log("Connected to the database"))
    .catch((error) => console.log(error))


app.use(adminControllers)
app.use(schoolControllers)
app.use(studentControllers)
app.use(teacherControllers)
app.use(classControllers)
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`The server is running on port ${port} `);
})


