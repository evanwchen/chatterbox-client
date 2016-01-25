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

retrieveData();

