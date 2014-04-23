jQuery(function(){
  game = new Jeopardy(config, theData);
});

var Jeopardy = function(_config, _answers){

  var config, answers;

  var init = function(){
    config = _config;
    answers = _answers;
    this.setupTitle();
    this.setupHeadings();
    this.setupColumns();
    this.setupExampleFile();
  };

  this.setupExampleFile = function(){
    jQuery("#example_file a").attr('href', config.example_file.file).text(config.example_file.text);
  };

  this.setupTitle = function(){
    jQuery("header h1").text(config.title);
    jQuery("title").text(config.title);
  };

  this.setupColumns = function(){
    jQuery("tbody tr").each(function(){
      var _parent = jQuery(this);
      var index = 1;
      jQuery(this).find("td").each(function(){
        console.log("th:nth-child("+index+")");
        var header = jQuery("th:nth-child("+index+")").text();
        var $question = jQuery(this);
        jQuery(this).on("click", function(){
          var current = jQuery(this);
          if(current.hasClass('remote-answer')){
            jQuery.prompt("<div class='prompt'>Reset before answering a new question</div>", {title: message, submit:function(e,v,m,f){return;}});
            return;
          }
          var message = header + " for " + jQuery(this).html();
          var bodyCopy = theData[_parent.attr('class')][current.attr('class')];
          var bodyCopy = "<div class='prompt'>"+bodyCopy+"</div>";
          jQuery.prompt(bodyCopy, {title: message, submit:function(e,v,m,f){ $question.toggleClass("answered") }});
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