var latestPostTime;

var initialLoad = true;

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
          if (initialLoad) {
            $('#chats').append($('<div class="username">' 
              + $ESAPI.encoder().encodeForHTML(item.username)
              + '</div><div class="message ">' 
              + $ESAPI.encoder().encodeForHTML(item.text)
              + '</div>'));
            latestPostTime = item.createdAt;
            
          } else if (item.createdAt > latestPostTime) {
            latestPostTime = item.createdAt;
            $('#chats').prepend($('<div class="username">' 
              + $ESAPI.encoder().encodeForHTML(item.username)
              + '</div><div class="message ">' 
              + $ESAPI.encoder().encodeForHTML(item.text)
              + '</div>'));
          }
        });
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
  }
};

app.fetch();

setInterval(app.fetch, 2000);

function testResults(form) {
  var msg = form.inputbox.value;
  var username = window.location.search.slice(10);

  var msgJSON = {
    username: username, 
    text: msg,
    roomname:'4chan'
  };

  app.send(msgJSON);
}