function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

$().ready(function() {
  $("#submit").click(function (event){
    event.preventDefault();
    var name = $("#name-input").val();
    if (name === "") {
      $("#name-input").parent().addClass("has-error");
      alert("Please enter your name.");
    }
    else {
      console.log($("#name-input").val());
      setCookie("name", $("#name-input").val(), 7);
      window.location.assign("/");
    }
  });
});