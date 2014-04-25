var RemoteClient = function(){

  var queryObject;

  var init = function(){
    this.client = new Faye.Client('http://murmuring-atoll-6726.herokuapp.com/faye');

    this.client.on('transport:down', function() {
      $(document).trigger( "faye:off" );
      online= false;
    });

    this.client.on('transport:up', function() {
      $(document).trigger( "faye:on" );
      online= true;
    });

    queryObject = $.deparam.querystring();
  };

  this.sessionId = function(){
    return queryObject.session || '';
  };

  this.sessionRequest = function(channel){
    return '/'+ [this.sessionId(), channel].filter(Boolean).join('/');
  };

  init.call(this);
};

RemoteClient.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
};

RemoteClient.clientId = RemoteClient.guid();

var Player = function(_game){

  var client;
  var remoteClient;
  var subscription;
  var _this;
  var join;
  var online = false;
  var game;
  this.playerName = '';
  this.mc = false;
  this.submitted = false;

  var init = function(){
    _this = this;
    game = _game;
    jQuery(document).on( "faye:on", function(event) {
      online= true;
    });
    remoteClient = new RemoteClient();
    client = remoteClient.client;
    subscription = client.subscribe(remoteClient.sessionRequest('submission'), function(status) {
      _this.checkResetStatus(status.mode);
      _this.checkAnsweredStatus(status.mode, status.name);
    });

    setTimeout(function(){
      publishJoin();
      if(!online){
        jQuery.prompt("Not Online Please Reload");
      }
      this.playerName = prompt("Your Name");
      if(this.playerName === 'mc'){
        this.mc = true;
        jQuery('.who-answered--reset').removeClass('is-hidden');
        join = subscribeJoin();
      }
    }, 1000);
  };

  var publishJoin = function(){
    client.publish(remoteClient.sessionRequest('join'), {name: this.playerName, id: RemoteClient.clientId});
  };

  var subscribeJoin = function(){
    return client.subscribe(remoteClient.sessionRequest('join'), function(resp) {
      game.broadcastState(resp.id);
    });
  };

  this.publishStatus = function(mode){
    client.publish(remoteClient.sessionRequest('submission'), {mode: mode, name: this.playerName});
  };

  this.checkResetStatus = function(status){
    if(status === 'reset'){
      this.submitted = false;
      jQuery('.Game td').each(function(){
        jQuery(this).removeClass('remote-answer');
        jQuery('.who-answered').addClass('is-hidden');
      });
    }
  };

  this.checkAnsweredStatus = function(status, name) {
    if(status === 'answered'){
      this.submitted = true;
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
var game;

jQuery(function(){
  $(document).on( "faye:off", function(event) {
    alert("faye offline");
  });
  game = new Jeopardy(config, theData);
  player = new Player(game);
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