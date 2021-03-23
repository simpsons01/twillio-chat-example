$(function () {
  // Get handle to the chat div
  var $chatWindow = $("#messages");

  // Our interface to the Chat service
  var chatClient;

  // A handle to the "general" chat channel - the one and only channel we
  // will have in this sample app
  var generalCoversation;

  // The server will assign the client a random username - store that value
  // here
  var username;

  // Helper function to print info messages to the chat window
  function print(infoMessage, asHtml) {
    var $msg = $('<div class="info">');
    if (asHtml) {
      $msg.html(infoMessage);
    } else {
      $msg.text(infoMessage);
    }
    $chatWindow.append($msg);
  }

  // Helper function to print chat message to the chat window
  function printMessage(fromUser, message) {
    var $user = $('<span class="username">').text(fromUser + ":");
    if (fromUser === username) {
      $user.addClass("me");
    }
    var $message = $('<span class="message">').text(message);
    var $container = $('<div class="message-container">');
    $container.append($user).append($message);
    $chatWindow.append($container);
    $chatWindow.scrollTop($chatWindow[0].scrollHeight);
  }

  // Alert the user they have been assigned a random username
  print("Logging in...");

  // Get an access token for the current user, passing a username (identity)
  $.getJSON("/get/user/max", function (data) {
    // Initialize the Chat client
    console.log("start created twilio client");
    Twilio.Conversations.Client.create(data.token).then((client) => {
      console.log("twilio client created!");
      username = data.identity;
      chatClient = client;
      chatClient.on("connectionStateChanged", (state) => {
        if (state === "connecting") print("Connecting to Twilio…");
        if (state === "connected") {
          console.log("twilio client connected");
          print("You are connected.");
        }
        if (state === "disconnecting") print("Disconnecting from Twilio…");
        if (state === "disconnected") print("Disconnected");
        if (state === "denied") print("Failed to connect.");
      });
      chatClient.on("conversationJoined", (conversation) => {
        if (data.cid === conversation.sid) {
          generalCoversation = conversation;
          setupConversation();
          console.log(generalCoversation);
        } else {
          conversation.leave();
        }
      });
    });
  });

  // Set up channel after it has been found
  function setupConversation() {
    generalCoversation.on("messageAdded", function (message) {
      const val = JSON.parse(message.body);
      printMessage(message.author, val.val);
    });
  }

  // Send a new message to the general channel
  var $input = $("#chat-input");
  $input.on("keydown", function (e) {
    if (e.keyCode == 13) {
      if (generalCoversation === undefined) {
        print(
          "The Chat Service is not configured. Please check your .env file.",
          false
        );
        return;
      }
      const payload = JSON.stringify({ val: $input.val() });
      generalCoversation.sendMessage(payload);
      $input.val("");
    }
  });
});
