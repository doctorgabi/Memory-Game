var _ = require('lodash');
var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var colors = require('colors');
// Colors
// bold, italic, underline, inverse, yellow, cyan,
// white, magenta, green, red, grey, blue, rainbow,
// zebra, random


/*
 * GET /
 */

exports.index = function(req, res){
  console.log('home.index');
  res.render('games/index', {title: 'Game'});
};


/*
 * POST /games/start
 */

exports.create = function(req, res){
  new Game(req.body).save(function(err, game, count){//.save sends it off the the db.
    for(var i = 0; i < game.numMatches; i++){
      var card = (i);
      game.cards.push(card);
      game.cards.push(card);
    }
    game.cards = _.shuffle(game.cards);
    game.save(function(err, game){
      res.send(game);//browser reqested something with a POST - this is node's response.
    });
    console.log(game.cards);
  });
};


/*
 * GET /games/:id
 */

exports.show = function(req, res){
  Game.findById(req.params.id, function(err, game){
    game.cardSelected = game.cards[req.query.cardIndex];
    game.cardIndex = req.query.cardIndex;
    game.save(function(err, game){
      res.send(game);
    });
  });
};
/*
 * GET /games/stop/:id
 */

exports.stop = function(req, res){
  //console.log('this is from routes/games req.body.timeTaken: ' + req.body.timeTaken);
  var time = req.body.timeTaken;
  Game.findById(req.params.id, function(err, game){
    game.timeTaken = time;
    game.save(function(err, game){
      res.send(game);//this is sending back to frontend app.js stopGame
    });
  });
};
