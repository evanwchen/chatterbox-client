org.owasp.esapi.ESAPI.initialize();

var app = {
  latestPostTime: "0",
  initialLoad: true,
  chatRooms: {all: 'all'},
  room: 'all',
  friends: {},

  init: function() {
    $(document).on('click','.username', function(){
      var username = $(this)[0].textContent;
      if (confirm('Add ' + username + ' as a friend?')) {
        app.friends[username] = true;
        $('#chats').empty();
        app.initialLoad = true;
        app.fetch();
      } else {
        return;
      }
    });

    app.fetch();
    var processID = setInterval(app.fetch, 3000);

  },

  send: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
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

          if (!app.chatRooms[itemRoomName] && itemRoomName) {
            app.chatRooms[itemRoomName] = itemRoomName;
            $('.chatrooms').append('<option value="'+ itemRoomName.slice(0,30) + '">' + itemRoomName.slice(0,30) + '</option>');
          }
          if (app.initialLoad) {
            if (item.createdAt > app.latestPostTime) {
              app.latestPostTime = item.createdAt;
            }
            if (app.room === 'all') {
              app.appendMessage(item);
            } else if (itemRoomName === app.room) {
              app.appendMessage(item);
            }
          } else if (item.createdAt > app.latestPostTime) {
            app.latestPostTime = item.createdAt;
            if (app.room === 'all') {
              app.startSpinner();
              app.prependMessage(item);
            } else if (itemRoomName === app.room) {
              app.startSpinner();
              app.prependMessage(item);
            }
          }
        });
        app.initialLoad = false;
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
    app.room = $ESAPI.encoder().encodeForHTML(roomName);
    app.initialLoad = true;
    $('#chats').empty();
    $('.chatrooms').val(roomName);
    app.fetch();
  },

  startSpinner: function() {
    $('.spinner').show();
  },

  stopSpinner: function() {
    $('.spinner').fadeOut('slow');
  },

  post: function(form) {
    var msg = form.inputbox.value;
    var username = window.location.search.slice(10);

    var msgJSON = {
      username: username, 
      text: msg,
      roomname: app.room
    };

    app.send(msgJSON);
  },

  getval: function(sel) {
    app.changeRooms(sel.value);
  }, 

  appendMessage: function(item) {
    if (app.friends[item.username]) {
      $('#chats').append($('<div class="username">' + 
        $ESAPI.encoder().encodeForHTML(item.username) +
        '</div><div class="message friend">' + 
        $ESAPI.encoder().encodeForHTML(item.text) + 
        '</div>'));
    } else {
      $('#chats').append($('<div class="username">' + 
        $ESAPI.encoder().encodeForHTML(item.username) +
        '</div><div class="message">' + 
        $ESAPI.encoder().encodeForHTML(item.text) + 
        '</div>'));
    }
  },

  prependMessage: function(item) {
    if (app.friends[item.username]) {
      $('#chats').prepend($('<div class="username">' + 
        $ESAPI.encoder().encodeForHTML(item.username) +
        '</div><div class="message friend">' +
        $ESAPI.encoder().encodeForHTML(item.text) +
        '</div>'));
    } else {
      $('#chats').prepend($('<div class="username">' + 
        $ESAPI.encoder().encodeForHTML(item.username) +
        '</div><div class="message">' +
        $ESAPI.encoder().encodeForHTML(item.text) +
        '</div>'));
    }
  }

};
