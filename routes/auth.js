const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {User} = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");



router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid email or password!!");

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword) return res.status(400).send("Invalid email or password!!");

    const token = user.generateAuthToken();

    res.send(token);
  });

function validate(user) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    };

    return Joi.validate(user, schema);
}



  module.exports = router;