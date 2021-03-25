const express = require("express");
const PORT = process.env.PORT || 8000;
const app = express();

require('./src/db/mongooseConnection');

const authRouter = require("./src/routers/auth");
const userRouter = require("./src/routers/user");

app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});