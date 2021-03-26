const express = require("express");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');

const router = new express.Router();

// Handler to login
router.post("/login", async (req, res) => {
    try {
        const userCred = req.body;
        const user = await User.findOne({ email: userCred.email });
        if (!user) {
            res.status(400).send({ message: "Invalid username or password" });
        }
        const isPasswordMatching = bcrypt.compare(userCred.password, user.password);
        if (!isPasswordMatching) {
            res.status(400).send({ message: "Invalid username or password" });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(e) {
        res.status(500).send("Error while logging in");
    }
});

// Handler to logout
router.post("/logout", auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = user.tokens.filter(token => token.token !== req.token);
        await user.save();
        res.send({message: "Successfully logged out"});
    } catch (e) {
        res.status(500).send("Error while logging out");
    }
});

module.exports = router;