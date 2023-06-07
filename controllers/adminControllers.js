

const admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const express = require("express")
const router= express.Router()
require("dotenv").config()

const generateAuthToken = (id) => {
  const token = jwt.sign({ id: id, isAdmin: true }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};


//my twilio credentials
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require("twilio")(accountSid, authToken);

//validating the user
const validateUser = (item) => {
  const Schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required(),
    phoneNumber: Joi.string().required().min(10),
    password: Joi.string().min(6).required().pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)
  .message(' the password must contain at least one alphabet, one digit, and one special character from the set !@#$%^&*. It should also be at least 6 characters long. If the password doesn')
  });
  return Schema.validate(item);
};

//function to send confirmation codes

const generateConfirmationCode = async () => {
  return Math.floor(1000 + Math.random() * 9000);
};


router.post("/createUser", async (req, res) => {
  try {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(404).send({ error: error.details[0].message });
  }

  const { email, password, phoneNumber } = req.body;
  //check if the user with that email exists in the database
  let user = await admin.findOne({ email });
  if (user) {
    return res.status(409).send("The user with that email already exists");
  }
  //send a confirmation code
  const confirmationCode = await generateConfirmationCode();
  const message = await client.messages.create({
    from: process.env.twilioPhoneNumber,
    to: phoneNumber,
    body: `Your confirmation code is ${confirmationCode}`,
  });

  if (!message) {
    return res.status(400).send("Failed to send a confirmation code");
  }

  console.log("Confirmation code sent successfully");

  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);
  user = await admin.create({ email, password: harshedPassword, phoneNumber });

  if (user) {
    return res.status(200).send(user);
  }
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }
}
)


router.post("/loginUser",async (req, res) => {
  const { email, password } = req.body;
  const user = await admin.findOne({ email });
  if (!user) {
    return res.status(404).send("Invalid email or password");
  }

  //harsh the request body password
  const salt = await bcrypt.genSalt(10);
  const harshedPassword = await bcrypt.hash(password, salt);

  if (!user.password == harshedPassword) {
    return res.status(404).send("Invalid email or password");
  }

  //generate the token for the user

  const token = await generateAuthToken(user._id);
  return res
    .status(200)
    .send({ message: "logged in successfully", Token: token });
}
)


router.post("/inviteTeacher", async (req, res) => {
  const { email } = req.body;
});

module.exports= router