var mongoose = require('mongoose');
var _ = require('lodash');

var Game = mongoose.Schema({
  player      : String,
  numMatches  : Number,
  cardIndex   : Number,
  cardSelected: Number,
  createdAt   : {type: Date, default: Date.now},
  didWin      : {type: Boolean, default: false},
  cards       : [Number],
  gameTime    : Number
});

mongoose.model('Game', Game);