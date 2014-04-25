var Jeopardy = function(_config, _answers){

  var config, answers;

  var remoteClient = new RemoteClient();
  var client = remoteClient.client;
  var whoPicked = '';

  var lastMessageId = '';
  var trigger = true;
  var questionSub;
  var questionClose;
  var broadcaseGameData;

  var init = function(){
    config = _config;
    answers = _answers;
    setupTitle();
    setupHeadings();
    setupColumns();
    this.setupExampleFile();
    questionSub = client.subscribe(remoteClient.sessionRequest('questionOpen'), function(resp) {
      trigger = false;
      whoPicked = resp.playerName;
      if(lastMessageId !== resp.id){
        jQuery(resp.element).click();
      }
      trigger = true;
      whoPicked = '';
    });
    questionClose = client.subscribe(remoteClient.sessionRequest('questionClose'), function(resp) {
      if(resp.element !== undefined){
        var respElement = jQuery(resp.element.replace('.answered',''));
        if(lastMessageId !== resp.id){
          respElement.toggleClass("answered");
        }
      }
      jQuery.prompt.close();
    });

    broadcaseGameData = client.subscribe(remoteClient.sessionRequest('broadcastState'), function(resp){
      if(RemoteClient.clientId === resp.id){
        answers = JSON.parse(resp.data);
        rebuildColumns();
      }
    });
  };

  this.broadcastState = function(clientId){
    client.publish(remoteClient.sessionRequest('broadcastState'), {data: JSON.stringify(answers), id: clientId});
  };

  var publishQuestion = function(elem, id){
    var playerName = '';
    if(!player.mc){
      playerName = player.playerName;
    }
    client.publish(remoteClient.sessionRequest('questionOpen'), {element: elem, id: id, playerName: playerName});
  };

  var closeQuestion = function(elem, id){
    client.publish(remoteClient.sessionRequest('questionClose'),{element: elem, id: id || 0});
  };

  this.setupExampleFile = function(){
    jQuery("#example_file a").attr('href', config.example_file.file).text(config.example_file.text);
  };

  var rebuildColumns = function(){
    jQuery('tbody tr td').off('.game-table');
    setupColumns();
  };

  var setupTitle = function(){
    jQuery("header h1").text(config.title);
    jQuery("title").text(config.title);
  };

  var setupColumns = function(){
    jQuery("tbody tr").each(function(){
      var _parent = jQuery(this);
      var index = 1;
      jQuery(this).find("td").each(function(){
        var header = jQuery("th:nth-child("+index+")").text();
        var $question = jQuery(this);
        if(answers[_parent.attr('class')][jQuery(this).attr('class')+"-answered"]){
          $question.toggleClass("answered");
        }
        jQuery(this).on("click.game-table", function(){
          var current = jQuery(this);
          answers[_parent.attr('class')][current.attr('class')+"-answered"]= true;
          if(trigger && !current.hasClass('remote-answer')){
            lastMessageId = RemoteClient.guid();
            publishQuestion(current.getSelector()[0], lastMessageId);
          }
          if(current.hasClass('remote-answer')){
            jQuery.prompt("<div class='prompt'>Reset before answering a new question</div>", {title: message, submit:function(e,v,m,f){closeQuestion();return false;}});
            return;
          }
          var name = '';
          if(whoPicked !== ''){
            name= "<strong>"+whoPicked +"</strong> Picked ";
          }
          var message = name + header + " for " + jQuery(this).html();
          var bodyCopy = answers[_parent.attr('class')][current.attr('class')];
          var bodyCopy = "<div class='prompt'>"+bodyCopy+"</div>";
          var buttons = {title: message, buttons:{}};
          if(!$('.who-answered--reset').hasClass('is-hidden')){
            buttons.submit = function(e,v,m,f){ $question.toggleClass("answered"); lastMessageId = RemoteClient.guid(); closeQuestion($question.getSelector()[0],lastMessageId); return false; };
            buttons.loaded = function(){jQuery('.jqibox').unbind('keydown');};
            buttons.buttons = {Ok:true};
          }
          jQuery.prompt(bodyCopy, buttons);
        });
        index++;
      });
    });
  };

  var setupHeadings = function(){
    columns = config.columns;
    for (var i in columns){
      var childIndex = parseInt(i) + 1;
      jQuery("th:nth-child("+childIndex+")").text(columns[i]);
    }
  };

  init.call(this);
};