jQuery(function(){
  game = new Jeopardy(config, theData);
});

var Jeopardy = function(_config, _answers){

  var config, answers;

  var client = new Faye.Client('http://murmuring-atoll-6726.herokuapp.com/faye');

  var lastMessageId = '';
  var trigger = true;
  var questionSub;
  var questionClose;

  var init = function(){
    config = _config;
    answers = _answers;
    this.setupTitle();
    this.setupHeadings();
    this.setupColumns();
    this.setupExampleFile();
    questionSub = client.subscribe('/questionOpen', function(resp) {
      trigger = false;
      if(lastMessageId !== resp.id){
        jQuery(resp.element).click();
      }
      trigger = true;
    });
    questionClose = client.subscribe('/questionClose', function(resp) {
      var respElement = jQuery(resp.element.replace('.answered',''));
      if(!respElement.hasClass('answered')){
        respElement.addClass("answered");
      }
      jQuery.prompt.close();
    });
  };

  var publishQuestion = function(elem, id){
    client.publish('/questionOpen', {element: elem, id: id});
  };

  var closeQuestion = function(elem){
    client.publish('/questionClose',{element: elem});
  }

  this.setupExampleFile = function(){
    jQuery("#example_file a").attr('href', config.example_file.file).text(config.example_file.text);
  };

  this.setupTitle = function(){
    jQuery("header h1").text(config.title);
    jQuery("title").text(config.title);
  };

  var guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };

  this.setupColumns = function(){
    jQuery("tbody tr").each(function(){
      var _parent = jQuery(this);
      var index = 1;
      jQuery(this).find("td").each(function(){
        var header = jQuery("th:nth-child("+index+")").text();
        var $question = jQuery(this);
        jQuery(this).on("click", function(){
          var current = jQuery(this);
          if(trigger){
            lastMessageId = guid();
            publishQuestion(current.getSelector()[0], lastMessageId);
          }
          if(current.hasClass('remote-answer')){
            jQuery.prompt("<div class='prompt'>Reset before answering a new question</div>", {title: message, submit:function(e,v,m,f){return false;}});
            return;
          }
          var message = header + " for " + jQuery(this).html();
          var bodyCopy = theData[_parent.attr('class')][current.attr('class')];
          var bodyCopy = "<div class='prompt'>"+bodyCopy+"</div>";
          var buttons = {title: message, buttons:{}};
          if(!$('.who-answered--reset').hasClass('is-hidden')){
            buttons.submit = function(e,v,m,f){ $question.toggleClass("answered"); closeQuestion($question.getSelector()[0]); return false; };
            buttons.loaded = function(){console.log('hi');jQuery('.jqibox').unbind('keydown');};
            buttons.buttons = {Ok:true};
          }
          jQuery.prompt(bodyCopy, buttons);
        });
        index++;
      });
    });
  };

  this.setupHeadings = function(){
    columns = config.columns;
    for (var i in columns){
      var childIndex = parseInt(i) + 1;
      jQuery("th:nth-child("+childIndex+")").text(columns[i]);
    }
  };

  init.call(this);
};