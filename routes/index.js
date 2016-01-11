var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('chatapp.db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FSE Chat Room' });
});

/* GET enter page. */
router.get('/enter', function(req, res, next) {
  res.render('enter', {title: 'Enter FSE Chat Room'})
});

/* POST latest n messages */
router.post('/latest_messages', function(req, res, next) {
  console.log(req.body);
  var n = req.body.n;
  if (n === null) {
    res.send('[]');
  }
  else {
    n = parseInt(n);
    db.all("SELECT * FROM (SELECT * FROM message ORDER BY id DESC LIMIT ?) ORDER BY id ASC", n.toString(), function(err, rows) {
      if (err !== null) {
        next(err);
      }
      else {
        res.send(JSON.stringify(rows));
      }
    });
  }
});

/* POST messages since message_id */
router.post('/messages_since', function(req, res, next) {
  var message_id = req.body.message_id;
  if (message_id === null) {
    res.send('[]');
  }
  else {
    message_id = parseInt(message_id);
    db.all("SELECT * FROM message WHERE id > ? ORDER BY id ASC", message_id, function(err, rows) {
      if (err !== null) {
        next(err);
      }
      else {
        res.send(JSON.stringify(rows));
      }
    }); 
  }
})

/* POST a new messages */
router.post('/post_message', function(req, res, next) {
  var author = req.body.author;
  var content = req.body.content;
  if (author === null || author === "" || content === null || content === "")
  {
    res.status(500).send("Missing input!");
  }
  else {
    db.serialize(function() {
      var stmt = db.prepare("INSERT INTO message (id, author, content) VALUES (NULL, ?, ?)");
      stmt.run(author, content);
      stmt.finalize();
    });
    res.send("Ok");
  }
});

module.exports = router;
