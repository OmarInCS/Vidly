const Joi = require('joi');
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true, 
           minlength: 3, maxlength: 15},
});

const Genre = mongoose.model("Genre", genreSchema);


function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(3).required()
    };
  
    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;