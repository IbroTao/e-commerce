const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const createProduct = require("./routes/cart.routes");
const orderProduct = require("./routes/order.routes");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/create", createProduct);
app.use("/api/order", orderProduct);

app.get("/api/test", () => {
  console.log("Success");
});

const { mongoConnection } = require("./configs/mongo");

const runServer = (port) => {
  mongoConnection()
    .then((res) => {
      app.listen(port);
      console.log(`Server is running on PORT ${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
runServer(port);
