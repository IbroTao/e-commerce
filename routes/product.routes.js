const {
  verifyAndAuthorizeUser,
  verifyAndAuthorizeAdmin,
} = require("../configs/middleware");
const { Product } = require("../models/product");

const router = require("express").Router();

//CREATE PRODUCT
router.post("/", verifyAndAuthorizeAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//UPDATE PRODUCT
router.put("/:id", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE PRODUCT
router.delete("/:id", verifyAndAuthorizeAdmin, async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET PRODUCT
router.get("/get/:id", async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    res.status(200).json(getProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//GET ALL PRODUCTS
router.get("/all", async (req, res) => {
  try {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    let product;
    if (qNew) {
      product = await Product.find().sort({ createdAt: "desc" }).limit(1);
    } else if (qCategory) {
      product = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      product = await Product.find();
    }
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
