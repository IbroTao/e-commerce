const { hashSync, compareSync } = require("bcryptjs");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET;
const router = require("express").Router();

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
    email: req.body.email,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json("Wrong Credentials!");

    const hashedPassword = compareSync(password, user.password);
    if (!hashedPassword) return res.status(401).json("Wrong Credentials!");

    const accessToken = jwt.sign(
      {
        sub: user._id,
        isAdmin: user.isAdmin,
      },
      SECRET,
      { expiresIn: "3d" }
    );

    const confirmUser = await User.findById(user._id).select(["-password"]);
    res.status(200).json({
      user: confirmUser,
      token: accessToken,
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
