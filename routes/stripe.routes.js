const router = require("express").Router();

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.token,
      amount: req.body.amount,
      currency: "USD",
    },
    (err, success) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(success);
      }
    }
  );
});
module.exports = router;
