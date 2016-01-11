var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('chatapp.db');

db.serialize(function() {
  db.run('DROP TABLE IF EXISTS message');
  db.run('CREATE TABLE message (id INTEGER PRIMARY KEY, content TEXT, author TEXT, timestamp DATATIME DEFAULT CURRENT_TIMESTAMP)');
  var stmt = db.prepare('INSERT INTO message (id, content, author) VALUES (NULL, ?, ?)');
  stmt.run('Welcome to FSE Chat Room! To start with, just type your message in the input box below and press submit button. ;)', 'SYSTEM');
  stmt.finalize();
  db.each('SELECT * FROM message', function(err, message) {
    console.log(message.id + ', ' + message.content + ', ' + message.author + ', ' + message.timestamp);
  })
});