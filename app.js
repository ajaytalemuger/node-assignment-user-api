const express = require("express");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('./src/db/mongooseConnection');

const PORT = process.env.PORT || 8000;
const app = express();

const authRouter = require("./src/routers/auth");
const userRouter = require("./src/routers/user");

// To store request logging in access.log file
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});