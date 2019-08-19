const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {Genre, validateGenre} = require("../models/genre");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

router.get('/', async (req, res) => {

  const genres = await Genre.find()
  res.send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genresCount = await Genre.find().count();

    const genre = new Genre({
      id: count + 1,
      name: req.body.name
    });
    
    const result = await genre.save();
    res.send(result);  
  }
  catch(err) {
    console.err(err);
  }

});

router.put('/:id', auth, async (req, res) => {
  const genre = await Genre.find({id: parseInt(req.params.id)});
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  genre.name = req.body.name;
  const result = await genre.save(); 
  res.send(result);
});

router.delete('/:id', [auth, isAdmin], async (req, res) => {
  const genre = await Genre.findOneAndRemove({id: parseInt(req.params.id)});
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.find({id: parseInt(req.params.id)});
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

module.exports = router;