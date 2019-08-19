const Joi = require('joi');
const mongoose = require("mongoose");


const Customer = mongoose.model("Customer", new mongoose.Schema({
    isGold: {type: Boolean, 
             default: false}, 
    name: {type: String, required: true, 
           minlength: 3, maxlength: 15},
    phone: {type: String, 
            minlength: 3, maxlength: 15},
}));


function validateCustomer(customer) {
    const schema = {
        isGold: Joi.boolean(),
        name: Joi.string().min(3).required(),
        phone: Joi.string()
    };

    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;