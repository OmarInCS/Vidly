const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { Customer, validateCustomer} = require("../models/customer");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");


router.get('/', async (req, res) => {

  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try {

    var customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    });
    
    customer = await customer.save();
    res.send(customer);  
  }
  catch(err) {
    console.err(err);
  }

});

router.put('/:id', auth, async (req, res) => {
  var customer = await Customer.find({id: parseInt(req.params.id)});
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  customer.isGold = req.body.isGold;
  customer.name = req.body.name;
  customer.phone = req.body.phone;
  customer = await customer.save(); 
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findOneAndRemove({id: parseInt(req.params.id)});
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.find({id: parseInt(req.params.id)});
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
});

module.exports = router;