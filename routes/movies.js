const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {Movie, validateMovie} = require("../models/movie");
const {Genre} = require("../models/genre");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");


router.get('/', async (req, res) => {

  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateMovie(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try {
    
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid genre!'); 

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    
    const result = await movie.save();
    res.send(result);  
  }
  catch(err) {
    console.err(err);
  }

});

router.put('/:id', auth, async (req, res) => {
  const movie = await Movie.find({_id: parseInt(req.params.id)});
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  const { error } = validateMovie(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  if(req.body.title) movie.title = req.body.title;
  if(req.body.genre) {
    movie.genre._id = genre._id;
    movie.genre.name = genre.name;
  }
  if(req.body.numberInStock) movie.numberInStock = req.body.numberInStock;
  if(req.body.dailyRentalRate) movie.dailyRentalRate = req.body.dailyRentalRate;
  
  const result = await movie.save(); 
  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findOneAndRemove({_id: parseInt(req.params.id)});
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.find({_id: parseInt(req.params.id)});
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

module.exports = router;