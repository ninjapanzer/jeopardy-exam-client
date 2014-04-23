var playerName = '';
var submitted = false;
var client = new Faye.Client('http://murmuring-atoll-6726.herokuapp.com/faye');

jQuery(function(){
  playerName = prompt("Your Name");
});

function publishStatus(){
  client.publish('/submission', {mode: 'answered'});
}

var subscription = client.subscribe('/submission', function(status) {
  if(status.mode === 'reset'){
    submitted = false;
    $('.Game td').each(function(){
      $(this).toggleClass('remote-answer');
    });
  }
  if(status.mode === 'answered'){
    submitted = true;
    $('.Game td').each(function(){
      $(this).toggleClass('remote-answer');
    });
  }
});

$(function(){
  $(document).on('keypress', function(evt){
    event.preventDefault();
    if ( event.which == 32 && submitted === false ) {
      publishStatus();
      submitted = true;
    }
  });
});