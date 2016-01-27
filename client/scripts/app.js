var latestPostTime = "0";

var initialLoad = true;

var chatRooms = {
  all: 'all'
};

var room = chatRooms.all;

var friends = {};

var filterFriends = true;

org.owasp.esapi.ESAPI.initialize();

var app = {
  init: function() {},

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        //latestPostTime = data.createdAt;
        console.log("succes, data:",data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: 'order=-updatedAt',
      contentType: 'application/json',
      success: function (data) {
        _.each(data.results, function(item) {
          var itemRoomName = $ESAPI.encoder().encodeForHTML(item.roomname);

          if (chatRooms[itemRoomName] === undefined && itemRoomName !== undefined) {
            chatRooms[itemRoomName] = itemRoomName;
            $('.chatrooms').append('<option value="'+ itemRoomName + '">' + itemRoomName + '</option>');
          }
          if (initialLoad) {
            if (item.createdAt > latestPostTime) {
              latestPostTime = item.createdAt;
            }
            if (room === 'all') {
              appendMessage(item);
            } else if (itemRoomName === room) {
              appendMessage(item);
            }
          } else if (item.createdAt > latestPostTime) {
            latestPostTime = item.createdAt;
            if (room === 'all') {
              app.startSpinner();
              prependMessage(item);
            } else if (itemRoomName === room) {
              app.startSpinner();
              prependMessage(item);
            }
          }
        });
        initialLoad = false;
        app.stopSpinner();
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  server: 'https://api.parse.com/1/classes/chatterbox',

  clearMessages: function() {
    $('#chats').empty();
  },

  addMessage: function(msg) {
    app.send(msg);
  },

  changeRooms: function(roomName) {
    room = $ESAPI.encoder().encodeForHTML(roomName);
    console.log(room);
    initialLoad = true;
    $('#chats').empty();
    $('.chatrooms').val(roomName);
    app.fetch();
  },

  startSpinner: function() {
    $('.spinner').show();
  },

  stopSpinner: function() {
    $('.spinner').fadeOut('slow');
  }

};

app.fetch();

var processID = setInterval(app.fetch, 3000);

function post(form) {
  var msg = form.inputbox.value;
  var username = window.location.search.slice(10);

  var msgJSON = {
    username: username, 
    text: msg,
    roomname: room
  };

  app.send(msgJSON);
}

function getval(sel) {
  app.changeRooms(sel.value);
}

function appendMessage(item) {
  if (friends[item.username]) {
    $('#chats').append($('<div class="username">' 
      + $ESAPI.encoder().encodeForHTML(item.username)
      + '</div><div class="message friend">' 
      + $ESAPI.encoder().encodeForHTML(item.text)
      + '</div>'));
  } else {
    $('#chats').append($('<div class="username">' 
      + $ESAPI.encoder().encodeForHTML(item.username)
      + '</div><div class="message">' 
      + $ESAPI.encoder().encodeForHTML(item.text)
      + '</div>'));
  }
}

function prependMessage(item) {
  if (friends[item.username]) {
    $('#chats').prepend($('<div class="username">' 
      + $ESAPI.encoder().encodeForHTML(item.username)
      + '</div><div class="message friend">' 
      + $ESAPI.encoder().encodeForHTML(item.text)
      + '</div>'));
  } else {
    $('#chats').prepend($('<div class="username">' 
      + $ESAPI.encoder().encodeForHTML(item.username)
      + '</div><div class="message">' 
      + $ESAPI.encoder().encodeForHTML(item.text)
      + '</div>'));
  }
}

$(document).on('click','.username', function(){
  var username = $(this)[0].textContent;
  if (confirm('Add ' + username + ' as a friend?')) {
    friends[username] = true;
    $('#chats').empty();
    initialLoad = true;
    app.fetch();
  } else {
    return;
  }
});
