org.owasp.esapi.ESAPI.initialize();

var retrieveData = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-updatedAt',
    contentType: 'application/json',
    success: function (data) {
      console.log(data);
      _.each(data.results, function(item) {
        $('#chats').append($('<div>' + 
          $ESAPI.encoder().encodeForHTML(item.text)
          + '</div>'));
      });


    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

// setInterval(retrieveData, 2000);


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
};

postMessage({username:'eSquared', text:'eSquared test 2',roomname:'4chan'});

retrieveData();

// $.post("https://api.parse.com/1/classes/chatterbox", function(data) {
//   $("#chats").html(data);
// });