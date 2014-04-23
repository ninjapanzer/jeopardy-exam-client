var playerName = '';
var mc = false;
var submitted = false;
var client = new Faye.Client('http://murmuring-atoll-6726.herokuapp.com/faye');

jQuery(function(){
  playerName = prompt("Your Name");
  if(playerName === 'mc'){
    mc = true;
    $('.who-answered--reset').removeClass('is-hidden');
  }
});

function publishStatus(mode){
  client.publish('/submission', {mode: mode, name: playerName});
}

function checkResetStatus(status){
  if(status === 'reset'){
    submitted = false;
    $('.Game td').each(function(){
      $(this).removeClass('remote-answer');
      $('.who-answered').addClass('is-hidden');
    });
  }
}

function checkAnsweredStatus(status, name){
  if(status === 'answered'){
    submitted = true;
    $('.Game td').each(function(){
      $(this).addClass('remote-answer');
      $('.who-answered--name').html(name);
      $('.who-answered').removeClass('is-hidden');
    });
  }
}

var subscription = client.subscribe('/submission', function(status) {
  checkResetStatus(status.mode);
  checkAnsweredStatus(status.mode, status.name);
});

$(function(){
  $(document).on('keypress', function(event){
    if ( event.which == 32 && submitted === false ) {
      publishStatus('answered');
      submitted = true;
    }
  });
  $('.who-answered--reset').on('click', function(){
    publishStatus('reset');
    $('.who-answered').addClass('is-hidden');

  });
});