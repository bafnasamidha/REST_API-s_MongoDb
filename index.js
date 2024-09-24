const express = require("express");

const app = express();

const userRouter = require("./routes/user");

const { connectMongoDb } = require("./connection");

connectMongoDb("mongodb://127.0.0.1:27017/rest_api");

//middleware
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);

app.listen(8000, () => {
  console.log("server started");
});
