var connect = require('connect');
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(function(req, res){
    res.end('page not found\n');
  })
 .listen(8080);
 
 var  io = require('socket.io').listen(app)

io.sockets.on('connection', function (socket) {
    socket.chatName = null;
  socket.on('message', function (message) {
      // var msg = { socket.id , message };
      var nick = socket.id;
      if(socket.chatName) {
          nick = socket.chatName;
      }
      socket.broadcast.emit('message', {message:[nick,message]});
  });
  
  socket.on('chatName', function(chatName){
      socket.chatName = chatName;
  })
});
