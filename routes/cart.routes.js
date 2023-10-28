const {
  verifyToken,
  verifyAndAuthorizeUser,
  verifyAndAuthorizeAdmin,
} = require("../configs/middleware");
const { Cart } = require("../models/cart");

const router = require("express").Router();

//CREATE CART
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//UPDATE CART
router.put("/:id", verifyAndAuthorizeUser, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateCart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//DELETE CART
router.delete("/:id", verifyAndAuthorizeUser, async (req, res) => {
  try {
    const deleteCart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET USER CART
router.get("/:userId", verifyAndAuthorizeUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET ALL USERS CART
router.get("/all", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const latestCart = req.query.new;
    let cart;
    if (latestCart) {
      cart = await Cart.find().sort({ createdAt: -1 }).limit(1);
    } else {
      cart = await Cart.find().sort({ createdAt: -1 });
    }
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
