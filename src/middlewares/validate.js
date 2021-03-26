const User = require('../models/user');

const mandatoryFieldsInPostbody = ["email", "name", "password"];

async function checkIfUserExist(req, res, next) {
    const { userId } = req.params
    const user = await getUser(userId);
    if (!user) {
        res.status(200).send({ error: "User not found" });
    } else {
        req.requestedUser = user;
        next();
    }
}

async function validateUserId(req, res, next) {
    const { userId } = req.params
    if (!userId.trim()) {
        res.status(400).send({ error: "Invalid userid" });
    } else {
        next();
    }
}

async function checkPostbody(req, res, next) {
    const body = req.body;
    if (!body) {
        res.status(400).send({ error: "Invalid post body" });
    } else if (!mandatoryFieldsInPostbody.every(key => Object.keys(body).includes(key))) {
        res.status(400).send({ error: "Mandatory fields are missing" });
    } else {
        let processedBody = {};
        mandatoryFieldsInPostbody.forEach(key => processedBody[key] = body[key]);
        req.body = processedBody;
        next();
    }
}

async function checkIfEmailAlreadyExists(req, res, next) {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        res.status(400).send({ error: "User email id already exists" });
    } else {
        next();
    }

}

async function getUser(userId) {
    return User.findById(userId);
}

module.exports = {
    checkIfUserExist,
    validateUserId,
    checkIfEmailAlreadyExists,
    checkPostbody
}