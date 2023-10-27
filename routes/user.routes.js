const { hashSync } = require("bcryptjs");
const {
  verifyAndAuthorizeUser,
  verifyAndAuthorizeAdmin,
} = require("../configs/middleware");
const { User } = require("../models/user");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyAndAuthorizeUser, async (req, res) => {
  if (req.body.password) {
    req.body.password = hashSync(req.body.password, 10);
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json("Username or email changed successfully!");
  } catch (err) {
    console.log(err);
  }
});

//DELETE
router.delete("/:id", verifyAndAuthorizeUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(err);
  }
});

//GET ALL USERS
router.get("/all", verifyAndAuthorizeAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1)
      : await User.find().sort({
          createdAt: "desc",
        });
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET LATEST USER
router.get("/latest", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const user = await User.find().sort({ _id: -1 }).limit(1);
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET USER STATS
router.get("/stats", verifyAndAuthorizeAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
