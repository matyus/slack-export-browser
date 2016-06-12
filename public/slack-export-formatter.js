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

    var ChannelNameTemplate = $('#template-channel-title').html();
    Mustache.parse(ChannelNameTemplate);

    //views
    var $room = $('#room');
    var $roomName = $('#room-name');
    var $menu = $('#menu');
    var $menuForm = $('#menu').children('#menu-form');
    var $menuSelect = $('#menu-channels');

    //bindings
    $menuSelect.on('click', 'a', function(e){
      e.preventDefault();
      getSpecificChannel(e);
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
      return _.map(channel, function(day) {
        return _.map(day, function(message) {

          var messageData = {
            name: users[message.user].real_name,
            message: message.text
          };

          return Mustache.render(MessageTemplate, messageData);
        }).join('');
      });
    }

    function formatChannels(channels) {
      return Mustache.render(FormTemplate, { channels: channels });
    }

    function formatChannelName(channelName) {
      return Mustache.render(ChannelNameTemplate, { channelName: channelName });
    }

    function getSpecificChannel(e) {
      var data = $(e.currentTarget).data();

      if('channelName' in data && data !== '') {
        var channelName = data.channelName;
        getChannel(channelName);
      }
    }

    function getChannel(channelName) {
      if(!channelName) {
        channelName = 'general';
      } else if(!channelName) {
        alert('Please choose a channel');
      }

      $.getJSON('/channel/' + channelName)
        .done(function(response, textStatus) {
          if(textStatus === SUCCESS) {
            channel = response;

            var title = formatChannelName(channelName);
            $roomName.html(title);
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
    } // eo getChannel

    //ajax
    $.getJSON('/channels')
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

    $.getJSON('/users')
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
