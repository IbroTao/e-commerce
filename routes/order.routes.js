const {
  verifyToken,
  verifyAndAuthorizeAdmin,
  verifyAndAuthorizeUser,
} = require("../configs/middleware");
const { Order } = require("../models/order");

const router = require("express").Router();

//PLACE ORDER
router.post("/create", verifyToken, async (req, res) => {
  const order = new Order(req.body);

  try {
    const savedOrder = await order.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE ORDER
router.put("/:id", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE ORDER
router.delete("/:id", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/all", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const order = await Order.find();
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET MONTHLY INCOME
//GET USERS ORDER(S)
router.get("/:userId", verifyAndAuthorizeUser, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
