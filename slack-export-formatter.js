'use strict';

(function(win, doc, $, _, moment) {
  'use strict';

  //constants
  var SUCCESS = 'success';

  //variables
  var users;
  var channels;
  var channel;


  //initialization
  $(function(){
    //templates
    var FormTemplate = $('#template-menu-form').html();
    Mustache.parse(FormTemplate);

    var MessageTemplate = $('#template-message').html();
    Mustache.parse(MessageTemplate);

    //views
    var $room = $('#room');
    var $menu = $('#menu');
    var $menuForm = $('#menu').children('#menu-form');
    var $menuSelect = $('#menu-channels');

    //bindings
    $menuForm.on('submit', function(e){
      e.preventDefault();
      getSpecificChannelOnSpecificDate(e);
    });

    //functions
    function init() {
      if(users && channel) {
        var conversation = formatConversation(users, channel);

        $room.html(conversation.join(''));
      }
    }

    function initMenu() {
      if(channels) {
        var list = formatChannels(channels);

        $menuSelect.html(list);
      }
    }

    function formatConversation(users, channel) {
      return _.map(channel, function(message) {

        var messageData = {
          name: users[message.user].real_name,
          message: message.text
        };

        return Mustache.render(MessageTemplate, messageData);
      });
    }

    function formatChannels(channels) {
      return Mustache.render(FormTemplate, { channels: channels });
    }

    function getSpecificChannelOnSpecificDate(e) {
      var formData = $(e.currentTarget).serialize();

      var channelName;
      var channelDate;

      formData.split('&').forEach(function(input, index) {
        var pair = input.split('=')
        var key = pair[0];
        var val = pair[1];

        if(key == 'menu-channels') {
          channelName = val;
        }

        if(key == 'menu-date') {
          channelDate = val;
        }

        if(channelName && channelDate) {
          getChannel(channelName, channelDate);
        }
      });
    }

    function getChannel(channelName, channelDate) {
      if(!channelName && !channelDate) {
        channelName = 'general';
        channelDate = '2016-05-18';
      } else if(channelName && !channelDate) {
        alert('Please provide a date');
      } else if(!channelName && channelDate) {
        alert('Please choose a channel');
      }

      $.getJSON('/export/'+ channelName +'/'+ channelDate +'.json')
        .done(function(response, textStatus) {
          if(textStatus === SUCCESS) {
            channel = response;
          } else {
            throw new Error('A problem occurred');
          }
        })
        .fail(function(response, textStatus) {
          alert('Date not found');
          throw new Error('Channel did not load.');
        })
        .always(function(response, textStatus) {
          init();
        });
    }

    //ajax
    $.getJSON('/export/channels.json')
      .done(function(response, textStatus) {
        if(textStatus === SUCCESS) {
          var list = _.map(response, function(channel) {
            return channel.membersLabel = channel.members.length == 1 ? 'person' : 'people';
          });

          channels = response;
        } else {
          throw new Error('A problem occurred');
        }
      })
      .fail(function(response, textStatus) {
        throw new Error('Channels did not load.');
      })
      .always(function(response, textStatus) {
        initMenu();
      });

    $.getJSON('/export/users.json')
      .done(function(response, textStatus) {
        if(textStatus === SUCCESS) {
          users = _.indexBy(response, function(user) {
            return user.id;
          });
        } else {
          throw new Error('A problem occurred');
        }
      })
      .fail(function(response, textStatus) {
        throw new Error('Users did not load.');
      })
      .always(function(response, textStatus) {
        init();
      });

    getChannel();
  });
})(window, document, jQuery, _, moment);
