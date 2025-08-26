const express = require('express');
const router = express.Router();
const path = require('path');
const profileModel = require('../models/profile');
const userModel = require('./users');
const multer = require('multer');
const formModel = require("../models/form");

// ----- Multer Setup -----
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ----- Check if profile exist -----
router.get('/exists/:userId', async (req, res) => {
  try {
    const profile = await profileModel.findOne({ user: req.params.userId });
    return res.status(200).json({ profile: !!profile });
  } catch (err) {
    res.status(500).json({ message: "error checking profile", err });
  }
});

// ----- Create Profile -----
router.post('/createprofile', isLoggedIn, upload.single('profilepic'), async function (req, res) {
  try {
    const userId = req.user._id;
    const { name, contact, email, bio } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = new profileModel({
      user: userId,
      name,
      contact,
      email,
      bio,
      profilepic: req.file ? `/images/upload/${req.file.filename}` : ''
    });

    await profile.save();
    res.status(200).json({ message: "profile created", profile });

  } catch (err) {
    res.status(500).json({ message: "Profile creation failed", err });
  }
});

// ----- Get Profile -----
router.get('/:userId', async function (req, res) {
  try {
    const profile = await profileModel.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ message: "something went wrong", err });
  }
});

// ----- Update Profile -----
router.patch('/update/:userId', upload.single('profilepic'), async (req, res) => {
  try {
    const { name, contact, email, bio } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (contact) updateData.contact = contact;
    if (bio) updateData.bio = bio;
    if (email) updateData.email = email;
    if (req.file) updateData.profilepic = `/images/upload/${req.file.filename}`;

    const updatedprofile = await profileModel.findOneAndUpdate(
      { user: req.params.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedprofile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ message: "Profile updated", updatedprofile });

  } catch (err) {
    res.status(500).json({ message: "Updation failed", err });
  }
});


// ----- Contact Form (no login required) -----
router.post("/api/contact", async function (req, res) {
  try {
    const { name, email, position, bio } = req.body;

    // 1️⃣ Save form (no user field required)
    // const formsubmit = new formModel({ name, email, position, bio });
    // await formsubmit.save();

    // 2️⃣ Setup email transporter
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shivlingkaradkar@gmail.com",
        pass: "blco bjfs urbo bomg"
      }
    });

    // 3️⃣ Send confirmation mail to HR
    await transporter.sendMail({
      from: "shivlingkaradkar@gmail.com",
      to: email,
      subject: "Form Submission Confirmation",
      text: `Hi ${name},

Thank you for contacting Shivling Karadkar.
Your form for the position "${position}" has been received.

Message:
${bio}

I will get back to you soon.

Regards,
Shivling Karadkar
`
    });

    // 4️⃣ Send notification mail to you
    await transporter.sendMail({
      from: "shivlingkaradkar@gmail.com",
      to: "shivlingkaradkar@gmail.com",
      subject: "New Contact Form Submitted",
      text: `New form submission:

Name: ${name}
Email: ${email}
Position: ${position}
Message: ${bio}
`
    });

    res.status(200).json({ message: "Form submitted successfully and emails sent", formsubmit });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong", error: err.message });
  }
});


// ----- Auth Middleware -----
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

module.exports = router;
