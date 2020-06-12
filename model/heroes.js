const mongoose = require('mongoose');

const {Schema} = mongoose;

const statsSchema = new Schema({
  strength: {type: Number, default: 30, min: 0, max: 100},
  perception: {type: Number, default: 30, min: 0, max: 100},
  endurance: {type: Number, default: 30, min: 0, max: 100},
  charisma: {type: Number, default: 30, min: 0, max: 100},
  intelligence: {type: Number, default: 30, min: 0, max: 100},
  agility: {type: Number, default: 30, min: 0, max: 100},
  luck: {type: Number, default: 30, min: 0, max: 100}
});

const heroesSchema = new Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String, required: true},
  origin: {type: String, default: 'Unknown'},
  stats: {type: statsSchema, required: true},
  squad: String
});

module.exports = mongoose.model('Hero', heroesSchema);