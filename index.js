const express = require("express");

require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
const { UserRouter } = require("./routes/user.routes");
const { auth } = require("./middlewares/auth");
const { postRouter } = require("./routes/post.routes")

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome to home page");
});

app.use("/users", UserRouter);
app.use(auth);
app.use("/post",postRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Db is connected");
  } catch (error) {
    console.log(error);
  }
  console.log(`server is running on port ${process.env.port}`);
});
