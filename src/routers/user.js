const express = require("express");
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');
const { checkIfUserExist, validateUserId, checkIfEmailAlreadyExists, checkPostbody } = require("../middlewares/validate");

// Array of fields allowed in search query. Used in find by seach query endpoint 
const allowedSearchFields = ['name', 'email', '_id'];

// handler to retrieve details of all the users
router.get("/", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Handler to retrieve details of a single user for the userid given in url parameter
router.get("/:userId", validateUserId, checkIfUserExist, async (req, res) => {
    try {
        res.send(req.requestedUser);
    } catch (e) {
        res.status(500).send({ error: "Error while retrieving user details" });
    }
});

// Handler to retrieve details of a single user for the search query given in post body
router.post("/search/", async (req, res) => {
    try {
        const searchQuery = req.body;
        if (validateSearchQuery(searchQuery)) {
            sendUserDetailsForSearchQuery(searchQuery, res)
        } else {
            res.status(400).send({ error: "Invalid search query" });
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: "Error while retrieving user details" });
    }
});

async function sendUserDetailsForSearchQuery(searchQuery, res) {
    const user = await User.findOne(searchQuery);
    if (user) {
        res.send(user);
    } else {
        res.send({ error: "No user found for the given search query" });
    }
}

function validateSearchQuery(searchQuery) {
    inputSearchFields = Object.keys(searchQuery);
    return inputSearchFields.every(searchField => allowedSearchFields.includes(searchField));
}

async function getUser(userId) {
    return User.findById(userId);
}

// Handler to update user details
router.patch("/:userId", auth, validateUserId, checkIfUserExist, async (req, res) => {
    try {
        const inputUserDetails = req.body;
        const user = req.requestedUser;
        Object.keys(inputUserDetails).forEach(updateField => user[updateField] = inputUserDetails[updateField]);
        await user.save();
        res.send({ message: "User details successfully updated", user });
    } catch (e) {
        res.status(500).send({ error: "Error occured while updating user details" });
    }
});

// Handler to create new user
router.post("/", auth, checkPostbody, checkIfEmailAlreadyExists, async (req, res) => {
    try {
        const userDetails = req.body;
        const user = await new User(userDetails);
        user.save();
        res.send({ message: "User successfully created", user });
    } catch (e) {
        res.status(500).send({ error: "Error occured while creating user" });
    }
});

// Handler to delete a user
router.delete("/:userId", auth, validateUserId, checkIfUserExist, async (req, res) => {
    try {
        const user = req.requestedUser;
        await user.remove();
        res.send({ message: "User successfully deleted", user });
    } catch (e) {
        res.status(500).send({ error: "Error occured while deleting user" });
    }
});

module.exports = router;