var RemoteClient = function(){

  var init = function(){
    this.client = new Faye.Client('http://murmuring-atoll-6726.herokuapp.com/faye');

    this.client.on('transport:down', function() {
      online= false;
    });

    this.client.on('transport:up', function() {
      online= true;
    });
  };

  init.call(this);
};

var Player = function(){

  var client;
  var subscription;
  var _this;
  this.playerName = '';
  this.mc = false;
  this.submitted = false;
  this.online = false;

  var init = function(){
    _this = this;
    client = new RemoteClient().client;
    subscription = client.subscribe('/submission', function(status) {
      _this.checkResetStatus(status.mode);
      _this.checkAnsweredStatus(status.mode, status.name);
    });

    playerName = prompt("Your Name");
    if(playerName === 'mc'){
      mc = true;
      jQuery('.who-answered--reset').removeClass('is-hidden');
    }
  };

  this.publishStatus = function(mode){
    client.publish('/submission', {mode: mode, name: playerName});
  };

  this.checkResetStatus = function(status){
    if(status === 'reset'){
      submitted = false;
      jQuery('.Game td').each(function(){
        jQuery(this).removeClass('remote-answer');
        jQuery('.who-answered').addClass('is-hidden');
      });
    }
  };

  this.checkAnsweredStatus = function(status, name) {
    if(status === 'answered'){
      submitted = true;
      jQuery('.Game td').each(function(){
        jQuery(this).addClass('remote-answer');
        jQuery('.who-answered--name').html(name);
        jQuery('.who-answered').removeClass('is-hidden');
      });
    }
  };

  init.call(this);
};

var player;

jQuery(function(){
  player = new Player();
});

jQuery(function(){
  jQuery(document).on('keypress', function(event){
    if ( event.which == 32 && player.submitted === false ) {
      player.publishStatus('answered');
      submitted = true;
    }
  });
  jQuery('.who-answered--reset').on('click', function(){
    player.publishStatus('reset');
    jQuery('.who-answered').addClass('is-hidden');
  });
});