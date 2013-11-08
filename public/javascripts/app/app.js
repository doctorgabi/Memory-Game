$(document).ready(initialize);

function initialize(){
  $(document).foundation();
  $('form#newGame').on('submit', submitNewGame);
  $('#gameSpace').on('click', '.card', clickCard);
}

// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

function submitNewGame(e){
  var url = '/games/start';
  var data = $(this).serialize();
  startTimer();
  sendGenericAjaxRequest(url, data, 'POST', null, e, function(data, status, jqXHR){
    htmlCreateCards(data);
  });
}

function clickCard(e){
  var cardIndex = $(this).data('card-index');
  var url = '/games/' + $(this).parent().data('game-id');
  sendGenericAjaxRequest(url, {cardIndex: cardIndex}, 'GET', null, e, function(data, status, jqXHR){
    htmlFlipCard(data);
  });
}

// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //
function htmlCreateCards(game){
  $('#gameSpace').attr('data-game-id', game._id);
  for(var i = 0; i < game.cards.length; i++){
    var $card = $('<div class="card"></div>').attr('data-card-index', [i]);
    $('#gameSpace').append($card);
  };
}

function startTimer(){
  var start = new Date;
  setInterval(function() {
    $('#timer').text(parseInt((new Date - start) / 1000) + " Seconds");
  }, 1000);
}

function htmlFlipCard(game){
  var cardValue = game.cardSelected;
  var cardIndex = game.cardIndex;
  cardIndex++;
  var $flippedCard = $('#gameSpace > div.card:nth-child('+cardIndex+')');
  $flippedCard.append($('<h2>'+ cardValue + '</h2>'));
  $flippedCard.addClass('active');
  compareCards($flippedCard, game);
}

function compareCards(card, game){
  var $card1 = $(card);
  if($('#gameSpace > div.active').length > 1){
    $card1.removeClass('active');
    var $card2 = $('#gameSpace > div.active');
    $card2.removeClass('active');
    if($card1.text() === $card2.text()){
      $card1.addClass('matched');
      $card2.addClass('matched');
    }else{
      setTimeout(
        function(){
        $card1.children('h2').remove();
        $card2.children('h2').remove();
        }, 1500);
    }
    if($('#gameSpace > div.matched').length == $('#gameSpace > div').length){
      stopGame(game);
    }
  }
}
// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

function sendGenericAjaxRequest(url, data, verb, altVerb, event, successFn){
  var options = {};
  options.url = url;
  options.type = verb;
  options.data = data;
  options.success = successFn;
  options.error = function(jqXHR, status, error){console.log(error);};

  if(altVerb) options.data._method = altVerb;
  $.ajax(options);
  if(event) event.preventDefault();
}

// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

function stopGame(game){
  var timeTaken = $('#timer').text();
  timeTaken = timeTaken.substring(0, timeTaken.length - 8);
  // console.log(timeTaken);
  $('#timer').remove();
  var url = '/games/stop/' + game._id;
  // console.log(game._id);
  sendGenericAjaxRequest(url, {timeTaken: timeTaken}, 'POST', 'PUT', null, function(data, status, jqXHR){
    htmlGameResults(data);
  });
}

function htmlGameResults(game){
  console.log(game.timeTaken);
  $('#gameSpace').empty();
  var $h1 = $('<h1>Congratulations ' + game.player + ', you completed the game in ' + game.timeTaken + ' seconds!</h1>');
  $('#gameSpace').append($h1);
}