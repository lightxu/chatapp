function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return "";
}

function deleteCookie(name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

/*
li.list-group-item
  span.badge= message.timestamp
  b=message.name
  br
  =message.content
*/
function generateMessageView(message) {
  var view = "";
  view += "<li class='list-group-item' data-id='"+message.id+"'>";
  view += "<span class='badge'>" + message.timestamp + "</span>";
  view += "<b>" + message.author + "</b>";
  if (message.name === name) {
    view += "<b>(You)</b>";
  }
  view += "<br>";
  view += message.content;
  view += "</li>";
  return view;
}

function displayMessages(messages) {
  for (var i in messages) {
    var message = messages[i];
    console.log(message);
    message_ids.push(message.id);
    $("#messages").append(generateMessageView(message));
  }
}

function fetchNewMessages(messages) {
  var last_message_id = message_ids[message_ids.length - 1];
  $.ajax({
    url: "/messages_since",
    contentType: "application/json",
    data: JSON.stringify({message_id: last_message_id}),
    method: "POST"
  }).done(function(data) {
    displayMessages(JSON.parse(data));
  }).fail(function(data) {
    console.log(data);
  });
}

var name;
var message_ids = new Array();

$().ready(function() {
  name = getCookie("name");
  if (name === "") {
    window.location.assign("/enter");
  }
  $("#message-input").attr("placeholder", "Hi, " + name + ". What's on your mind?");
  console.log(name);

  // load last 10 messages;
  $.ajax({
    url: "/latest_messages",
    contentType: "application/json",
    data: JSON.stringify({n: 10}),
    method: "POST"
  }).done(function(data) {
    displayMessages(JSON.parse(data));
  }).fail(function(data) {
    alert("Error loading messages.");
  });

  // handle post message
  $("#submit").click(function(e) {
    e.preventDefault();
    var content = $("#message-input").val();
    if (content === "")
      return;
    $.ajax({
      url: "/post_message",
      contentType: "application/json",
      data: JSON.stringify({
        author: name,
        content: content
      }),
      method: "POST"
    }).done(function(data) {
      $("#message-input").val("");
      fetchNewMessages();
    }).fail(function(data) {
      alert(data);
    });
  });

  // fetch new messages every 5 seconds
  setInterval(fetchNewMessages, 1000);

  // leave chat room
  $("#leave").click(function() {
    deleteCookie("name");
    window.location.assign("/enter");
  });
});