const express = require("express")
const app = express()
app.use(express.json());
require("dotenv").config();
const lessonControllers = require("./controllers/lessonControllers")
const marksControllers = require("./controllers/marksControllers")
const schoolControllers = require("./controllers/schoolControllers")
const teacherControllers = require("./controllers/teacherControllers")
const studentControllers = require("./controllers/studentControllers")
const classControllers= require("./controllers/classControllers")
const adminControllers  = require("./controllers/adminControllers")
const mongooose = require("mongoose")
mongooose.connect(process.env.mongodbUrl)
    .then(() => console.log("Connected to the database"))
    .catch((error) => console.log(error))

app.use(marksControllers)
app.use(adminControllers)
app.use(schoolControllers)
app.use(studentControllers)
app.use(teacherControllers)
app.use(classControllers)
app.use(lessonControllers)
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`The server is running on port ${port} `);
})


