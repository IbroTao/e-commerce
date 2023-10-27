const express = require("express");
const app = express();
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");

require("dotenv").config();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

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
