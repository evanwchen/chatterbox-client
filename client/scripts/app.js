org.owasp.esapi.ESAPI.initialize();

// var latestPostTime = new Date();
var latestPostTime;

var initialLoad = true;

var retrieveData = function() {
  // $('#chats').empty();
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-updatedAt',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      _.each(data.results, function(item) {
        if (initialLoad) {
          $('#chats').append($('<div class="username">' 
            + $ESAPI.encoder().encodeForHTML(item.username)
            + '</div><div class="message ">' 
            + $ESAPI.encoder().encodeForHTML(item.text)
            + '</div>'));
          latestPostDate = item.createdAt;
          
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
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var postMessage = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log("success");
      console.log("data:", data);
      console.log("message:", message);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  var time = new Date();
};

// retrieveData();


function testResults(form) {
  var msg = form.inputbox.value;
  var username = window.location.search.slice(10);

  var msgJSON = {
    username: username, 
    text: msg,
    roomname:'4chan'
  };

  postMessage(msgJSON);
}
retrieveData();
setInterval(retrieveData, 2000);