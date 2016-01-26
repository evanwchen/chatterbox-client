var latestPostTime = "0";

var initialLoad = true;

var chatRooms = {
  all: 'all'
};

var room = chatRooms.all;

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
    console.log(room);
    $.ajax({
      url: app.server,
      type: 'GET',
      data: 'order=-updatedAt',
      contentType: 'application/json',
      success: function (data) {
        _.each(data.results, function(item) {
          if (chatRooms[item.roomname] === undefined && item.roomname !== undefined) {
            chatRooms[item.roomname] = item.roomname;
            $('.chatrooms').append('<option value="'+ item.roomname + '">' + item.roomname + '</option>');
          }
          console.log('latest ', latestPostTime);
          console.log('item createdAt ', item.createdAt)
          if (initialLoad) {
            if (item.createdAt > latestPostTime) {
              latestPostTime = item.createdAt;
            }
            if (room === 'all') {
              $('#chats').append($('<div class="username">' 
                + $ESAPI.encoder().encodeForHTML(item.username)
                + '</div><div class="message">' 
                + $ESAPI.encoder().encodeForHTML(item.text)
                + item.roomname
                + '</div>'));
            } else if (item.roomname === room) {
              // console.log(item.text);
              $('#chats').append($('<div class="username">' 
                + $ESAPI.encoder().encodeForHTML(item.username)
                + '</div><div class="message">' 
                + $ESAPI.encoder().encodeForHTML(item.text)
                + item.roomname
                + '</div>'));
            }
          } else if (item.createdAt > latestPostTime) {
            latestPostTime = item.createdAt;
            console.log('reached update condition');
            if (room === 'all') {
              $('#chats').prepend($('<div class="username">' 
                + $ESAPI.encoder().encodeForHTML(item.username)
                + '</div><div class="message">' 
                + $ESAPI.encoder().encodeForHTML(item.text)
                + item.roomname
                + '</div>'));
            } else if (item.roomname === room) {
              // console.log(item.text + " 2nd?");
              $('#chats').prepend($('<div class="username">' 
                + $ESAPI.encoder().encodeForHTML(item.username)
                + '</div><div class="message">' 
                + $ESAPI.encoder().encodeForHTML(item.text)
                + item.roomname
                + '</div>'));
            }
          }
        });
        // console.log('latest:',latestPostTime);

        initialLoad = false;
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
    room = roomName;
    initialLoad = true;
    $('#chats').empty();
    $('.chatrooms').val(roomName);
    app.fetch();
  }
};

app.fetch();

var processID = setInterval(app.fetch, 2000);

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
  $('#chats').append($('<div class="username">' 
    + $ESAPI.encoder().encodeForHTML(item.username)
    + '</div><div class="message">' 
    + $ESAPI.encoder().encodeForHTML(item.text)
    + item.roomname
    + '</div>'));
}