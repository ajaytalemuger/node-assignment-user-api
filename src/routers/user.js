const express = require("express");
const router = new express.Router();
const User = require('../models/user');

// Array of fields allowed in search query. Used in find by seach query endpoint 
const allowedSearchFields = ['name', 'email', '_id'];

// handler to retrieve details of all the users
router.get("/", async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Handler to retrieve details of a single user for the userid given in url parameter
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const user = await getUser(userId);
        res.send(user);
    } catch (e) {
        console.log(e.message);
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
            res.status(400).send({ message: "Invalid search query" });
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
        res.send({ message: "No user found for the given search query" });
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
router.patch("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const inputUserDetails = req.body;
        const user = await getUser(userId);
        Object.keys(inputUserDetails).forEach(updateField => user[updateField] = inputUserDetails[updateField]);
        await user.save();
        res.send({ message: "User details successfully updated" });
    } catch (e) {
        res.status(500).send({ error: "Error occured while updating user details" });
    }
});

// Handler to create new user
router.post("/", async (req, res) => {
    try {
        const userDetails = req.body;
        await new User(userDetails).save();
        res.send({ message: "User successfully created" });
    } catch (e) {
        res.status(500).send({ error: "Error occured while creating user" });
    }
});

// Handler to delete a user
router.delete("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await getUser(userId);
        await user.remove();
        res.send({ message: "User successfully deleted" });
    } catch (e) {
        res.status(500).send({ error: "Error occured while deleting user" });
    }
});

module.exports = router;